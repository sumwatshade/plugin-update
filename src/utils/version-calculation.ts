import * as semver from 'semver';

const EXTENDED_SEMVER_REGEX =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?/;

const SEMVER_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;

const FUZZY_SEMVER_REGEX = /^(\d+)\.?(\d+)?\.?(\d+)?$/;

const getMatchingVersions = async (
  versionList: string[],
  targetVersion: string,
  channel: string,
  prereleaseChannels: string[],
): Promise<string[]> => {
  const isTargetExplicitSemver = FUZZY_SEMVER_REGEX.test(targetVersion);

  return versionList
    .filter((version) => {
      // - If the version contains 'partial', ignore it
      if (version.includes('partial')) {
        return false;
      }

      if (isTargetExplicitSemver && SEMVER_REGEX.test(version)) {
        // Ex: 2.1 should capture 2.1.3, 2.1.4, 2.1.5, but not 2.2.0
        return version.startsWith(targetVersion);
      }
      // - If we request stable, only provide standard versions...
      if (channel === 'stable') {
        return !prereleaseChannels.some((c) => version.includes(c));
      }
      // - ... otherwise check if the version is contained
      return version.includes(targetVersion);
    })
    .sort((a, b) => semver.compare(b, a));
};

export {
  getMatchingVersions,
  SEMVER_REGEX,
  EXTENDED_SEMVER_REGEX,
  FUZZY_SEMVER_REGEX,
};
