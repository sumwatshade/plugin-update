import { getMatchingVersions } from '../../src/utils/version-calculation';

const PRERELEASE_CHANNELS = ['alpha', 'next'];
describe('Version Calculation', () => {
  it('fetches a channel-specific set of non-partial channel versions', async () => {
    const versionMatch = await getMatchingVersions(
      [
        '3.0.0-next.0',
        '3.0.0-next.1',
        '2.4.0',
        '3.0.0-next.3',
        '3.0.0-next.4',
        '3.0.0-alpha.4',
      ],
      'next',
      'next',
      PRERELEASE_CHANNELS,
    );
    expect(versionMatch).toStrictEqual([
      '3.0.0-next.4',
      '3.0.0-next.3',
      '3.0.0-next.1',
      '3.0.0-next.0',
    ]);
  });

  it('only fetches semvers when stable channel is provided', async () => {
    const versionMatch = await getMatchingVersions(
      ['2.4.0', '2.6.0', '2.0.0-next.3', '3.0.0-alpha.5'],
      '2.6.0',
      'stable',
      PRERELEASE_CHANNELS,
    );

    expect(versionMatch).toStrictEqual(['2.6.0']);
  });

  it('only fetches semvers when stable channel is targeted', async () => {
    const versionMatch = await getMatchingVersions(
      ['2.4.0', '2.6.0', '2.0.0-next.3', '3.0.0-alpha.5'],
      'stable',
      'stable',
      PRERELEASE_CHANNELS,
    );

    expect(versionMatch).toStrictEqual(['2.6.0', '2.4.0']);
  });

  it('Will search for up to the latest minor', async () => {
    const versionMatch = await getMatchingVersions(
      [
        '2.4.0',
        '2.4.1',
        '2.6.1',
        '2.4.2',
        '2.6.0',
        '2.0.0-next.3',
        '3.0.0-alpha.5',
      ],
      '2.4',
      'stable',
      PRERELEASE_CHANNELS,
    );

    expect(versionMatch).toStrictEqual(['2.4.2', '2.4.1', '2.4.0']);
  });
});
