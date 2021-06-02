import cli from 'cli-ux'
import * as fs from 'fs-extra'
import * as semver from 'semver'

import UpdateCommand from './update'

export default class UseCommand extends UpdateCommand {
  static args = [{name: 'version', optional: false}];

  static flags = {};

  async run() {
    const {args} = this.parse(UseCommand)

    // Check if this command is trying to update the channel. TODO: make this dynamic
    const channelUpdateRequested = ['alpha', 'beta', 'next', 'stable'].some(
      c => args.version === c,
    )
    this.channel = channelUpdateRequested ?
      args.version :
      await this.determineChannel()

    const targetVersion = semver.clean(args.version || '') || args.version

    // Determine if the version is from a different channel and update to account for it (ex. cli-example update 3.0.0-next.22 should update the channel to next as well.)
    const versionParts = targetVersion?.split('-') || ['', '']
    if (versionParts && versionParts[1]) {
      this.channel = versionParts[1].substr(0, versionParts[1].indexOf('.'))
      this.debug(`Flag overriden target channel: ${this.channel}`)
    }

    await this.ensureClientDir()
    this.debug(`Looking for locally installed versions at ${this.clientRoot}`)

    // Do not show known non-local version folder names, bin and current.
    const versions = fs
    .readdirSync(this.clientRoot)
    .filter(dirOrFile => dirOrFile !== 'bin' && dirOrFile !== 'current')
    if (versions.length === 0)
      throw new Error('No locally installed versions found.')
    const matchingLocalVersions = versions
    .filter(version => version.includes(targetVersion))
    .sort((a, b) => semver.compare(b, a))

    if (versions.includes(targetVersion) || matchingLocalVersions.length > 0) {
      const target = versions.includes(targetVersion) ? targetVersion : matchingLocalVersions[0]
      await this.updateToExistingVersion(target)
      this.currentVersion = await this.determineCurrentVersion()
      this.updatedVersion = target
      if (channelUpdateRequested) {
        await this.setChannel()
      }
      this.log(`Success! You are now on ${target}!`)
    } else {
      const localVersionsMsg = `Locally installed versions available: \n${versions.map(version => `\t${version}`).join('\n')}\n`

      throw new Error(
        `Requested version could not be found locally. ${localVersionsMsg} If your requested version is not available locally, please try running \`${this.config.bin} install ${targetVersion}\``,
      )
    }

    this.log()
    this.debug('done')
    cli.action.stop()
  }
}
