import * as semver from 'semver';

/**
 * Extended Semvers can optionally include prereleases
 * @example 2.3.0
 * @example 3.0.0-next.123
 * @example 3.4.5-alpha
 */
const EXTENDED_SEMVER_REGEX =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?/;

/**
 * Explicit semvers can be any major/minor/patch semver
 *
 * @example 2.1.0
 * @example 1.2.3
 * @example 21.10.333
 */
const SEMVER_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;

/**
 * Fuzzy semvers can be any (potentially truncated) major/minor/patch semver
 *
 * @example 2.1.0
 * @example 2.0
 * @example 2
 */
const FUZZY_SEMVER_REGEX = /^(\d+)\.?(\d+)?\.?(\d+)?$/;

/**
 * Verifies if a version string is an explicit semver
 *
 * @param version The tested version string
 * @returns If the version is an explicit semver @see {SEMVER_REGEX}
 */
const isExplicitSemver = async (version: string): Promise<boolean> => {
  return SEMVER_REGEX.test(version);
};

/**
 * Verifies if a version string is a semver alias
 * @see FUZZY_SEMVER_REGEX
 *
 * @param version The tested version string
 * @returns If the version is an explicit semver
 */
const isSemverAlias = async (version: string): Promise<boolean> => {
  return !SEMVER_REGEX.test(version) && FUZZY_SEMVER_REGEX.test(version);
};

/**
 * Verifies if a version string is any type of semver
 *
 * @param version The tested version string
 * @returns If the version is any type of semver
 */
const isAnySemver = async (version: string): Promise<boolean> => {
  return (
    EXTENDED_SEMVER_REGEX.test(version) || FUZZY_SEMVER_REGEX.test(version)
  );
};

const getMatchingVersions = async (
  versionList: string[],
  targetVersion: string,
  channel: string,
  prereleaseChannels: string[],
): Promise<string[]> => {
  const isTargetNonPrereleaseSemver = FUZZY_SEMVER_REGEX.test(targetVersion);

  return versionList
    .filter((version) => {
      // - If the version contains 'partial', ignore it
      if (version.includes('partial')) {
        return false;
      }

      if (isTargetNonPrereleaseSemver && isExplicitSemver(version)) {
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
  isExplicitSemver,
  isAnySemver,
  isSemverAlias,
  SEMVER_REGEX,
  EXTENDED_SEMVER_REGEX,
  FUZZY_SEMVER_REGEX,
};
