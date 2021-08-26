import cli from 'cli-ux';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import { getMatchingVersions, isAnySemver } from '../utils/version-calculation';

import UpdateCommand from './update';

export default class UseCommand extends UpdateCommand {
  static description =
    'Checks for a previously installed version of the <%= config.bin %> CLI. Throws an error if the version is not found.';

  static args = [
    {
      name: 'version',
      description:
        'Specify an explicit version (ex. 3.0.0-next.1) or a channel (ex. alpha)',
      required: false,
    },
  ];

  static flags = {};

  async run() {
    const { args } = this.parse(UseCommand);

    // Check if this command is trying to update the channel. TODO: make this dynamic
    const prereleaseChannels = ['alpha', 'beta', 'next'];
    const isArgSemver = await isAnySemver(args.version ?? '');
    const channelUpdateRequested = ['stable', ...prereleaseChannels].some(
      (c) => args.version === c,
    );

    if (!isArgSemver && !channelUpdateRequested) {
      throw new Error(
        `Invalid argument provided: ${args.version}. Please specify either a valid channel (alpha, beta, next, stable) or an explicit version (ex. 2.68.13)`,
      );
    }

    this.channel = channelUpdateRequested
      ? args.version
      : await this.determineChannel();

    const targetVersion = semver.clean(args.version || '') || args.version;

    // Determine if the version is from a different channel and update to account for it (ex. cli-example update 3.0.0-next.22 should update the channel to next as well.)
    const versionParts = targetVersion?.split('-') || ['', ''];
    if (versionParts && versionParts[1]) {
      this.channel = versionParts[1].substr(0, versionParts[1].indexOf('.'));
      this.debug(`Flag overriden target channel: ${this.channel}`);
    }

    await this.ensureClientDir();
    this.debug(`Looking for locally installed versions at ${this.clientRoot}`);

    // Do not show known non-local version folder names, bin and current.
    let versions: string[] = [];
    try {
      versions = fs
        .readdirSync(this.clientRoot)
        .filter((dirOrFile) => dirOrFile !== 'bin' && dirOrFile !== 'current');
    } catch {}

    // Back out if no local versions are found
    if (versions.length === 0)
      throw new Error('No locally installed versions found.');

    // Get matching versions
    const matchingLocalVersions = await getMatchingVersions(
      versions,
      targetVersion,
      this.channel,
      prereleaseChannels,
    );

    if (
      args.version &&
      (versions.includes(targetVersion) || matchingLocalVersions.length > 0)
    ) {
      const target = versions.includes(targetVersion)
        ? targetVersion
        : matchingLocalVersions[0];
      await this.updateToExistingVersion(target);
      this.currentVersion = await this.determineCurrentVersion();
      this.updatedVersion = target;
      if (channelUpdateRequested) {
        await this.setChannel();
      }
      this.log(`Success! You are now on ${target}!`);
    } else {
      const localVersionsMsg = `Locally installed versions available: \n${versions
        .map((version) => `\t${version}`)
        .join('\n')}\n`;

      throw new Error(
        `Requested version could not be found locally. ${localVersionsMsg}`,
      );
    }

    this.log();
    this.debug('done');
    cli.action.stop();
  }
}
