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
      const prereleaseChannels = ['alpha', 'beta', 'next']
      const channelUpdateRequested = ['stable', ...prereleaseChannels].some(
        c => args.version === c,
      )
      this.channel = channelUpdateRequested ? args.version : await this.determineChannel()

      const targetVersion = semver.clean(args.version) || args.version
      // Determine if the version is from a different channel and update to account for it (ex. cli-example update 3.0.0-next.22 should update the channel to next as well.)
      const versionParts = targetVersion?.split('-') || ['', '']
      if (versionParts && versionParts[1]) {
        this.channel = versionParts[1].substr(0, versionParts[1].indexOf('.'))
        this.debug(`Flag overriden target channel: ${this.channel}`)
      }

      const versions = fs
      .readdirSync(this.clientRoot)
      .filter(dirOrFile => dirOrFile !== 'bin' && dirOrFile !== 'current')

      if (versions.includes(targetVersion)) {
        await this.updateToExistingVersion(targetVersion)
        this.currentVersion = await this.determineCurrentVersion()
        this.updatedVersion = targetVersion
        if (channelUpdateRequested) {
          await this.setChannel()
        }
      } else {
        let specifiVersion
        if (targetVersion !== this.channel) {
          specifiVersion = targetVersion
        }
        cli.action.start(`${this.config.name}: Updating CLI`)
        await this.config.runHook('preupdate', {channel: this.channel})
        const manifest = await this.fetchManifest()
        this.currentVersion = await this.determineCurrentVersion()

        this.updatedVersion = (manifest as any).sha ? `${targetVersion}-${(manifest as any).sha}` : targetVersion
        this.debug(`Updating to ${this.updatedVersion}`)
        const reason = await this.skipUpdate()
        if (reason) cli.action.stop(reason || 'done')
        else await this.update(manifest, this.channel, specifiVersion)
        this.debug('tidy')
        await this.tidy()
        await this.config.runHook('update', {channel: this.channel})

        this.debug('done')
        cli.action.stop()
      }
    }
}
