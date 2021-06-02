import cli from 'cli-ux'
import * as semver from 'semver'
import * as fs from 'fs-extra'

import UpdateCommand from './update'

export default class InstallCommand extends UpdateCommand {
    static args = [{name: 'version', optional: false}]

    static flags = {}

    async run() {
      const {args} = this.parse(InstallCommand)

      // Check if this command is trying to update the channel. TODO: make this dynamic
      const channelUpdateRequested = ['alpha', 'beta', 'next', 'stable'].some(c => args.version === c)
      this.channel = channelUpdateRequested ? args.version : await this.determineChannel()
      const versions = fs
      .readdirSync(this.clientRoot)
      .filter(dirOrFile => dirOrFile !== 'bin' && dirOrFile !== 'current')

      const targetVersion = semver.clean(args.version) || args.version

      if (versions.includes(targetVersion)) {
        await this.updateToExistingVersion(targetVersion)
        this.currentVersion = await this.determineCurrentVersion()
        this.updatedVersion = targetVersion
        if (channelUpdateRequested) {
          await this.setChannel()
        }
      } else {
        cli.action.start(`${this.config.name}: Updating CLI`)
        await this.config.runHook('preupdate', {channel: this.channel})
        const manifest = await this.fetchManifest()
        this.currentVersion = await this.determineCurrentVersion()

        this.updatedVersion = (manifest as any).sha ? `${targetVersion}-${(manifest as any).sha}` : targetVersion
        this.debug(`Updating to ${this.updatedVersion}`)
        const reason = await this.skipUpdate()
        if (reason) cli.action.stop(reason || 'done')
        else await this.update(manifest, this.channel)
        this.debug('tidy')
        await this.tidy()
        await this.config.runHook('update', {channel: this.channel})

        this.debug('done')
        cli.action.stop()
      }
    }
}
