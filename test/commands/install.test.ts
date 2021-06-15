import InstallCommand from '../../src/commands/install';
import * as fs from 'fs-extra';
import { mocked } from 'ts-jest/utils';
import { Config } from '@oclif/config';

jest.mock('fs-extra');
jest.mock('http-call', () => ({
  HTTP: {
    get: jest.fn(),
  },
}));
const mockFs = mocked(fs, true);

class MockedInstallCommand extends InstallCommand {
  public channel!: string;

  public clientBin!: string;

  public clientRoot!: string;

  public currentVersion!: string;

  public updatedVersion!: string;

  public determineCurrentVersion = jest.fn();

  public downloadAndExtract = jest.fn();

  public reexec = jest.fn();

  public updateToExistingVersion = jest.fn();
}

describe('Install Command', () => {
  let commandInstance: MockedInstallCommand;
  const config = new Config({
    root: process.cwd(),
  });
  const { HTTP: http } = require('http-call');
  beforeEach(async () => {
    mockFs.existsSync.mockReturnValue(true);
    await config.load();
  });

  it('when requesting a channel, will fetch manifest to install the latest version', async () => {
    config.pjson.oclif.update.s3.host = 'https://test-cli-oclif.com/';
    config.binPath = 'cli';
    mockFs.readdirSync.mockReturnValue([] as any);
    commandInstance = new MockedInstallCommand(['next'], config);

    http.get.mockResolvedValue({
      body: {
        version: '1.0.0',
        baseDir: 'test-cli',
        channel: 'next',
        gz: 'https://test-cli-oclif.s3.amazonaws.com/test-cli-v1.0.0/test-cli-v1.0.0.tar.gz',
      },
    });

    await commandInstance.run();

    expect(commandInstance.downloadAndExtract).toBeCalled();
    expect(commandInstance.updatedVersion).toBe('next');
  });

  it('when requesting a version, will return the explicit version with appropriate URL', async () => {
    config.pjson.oclif.update.s3.host = 'https://test-cli-oclif.com/';
    config.binPath = 'cli';
    mockFs.readdirSync.mockReturnValue([] as any);
    commandInstance = new MockedInstallCommand(['2.2.1-next.22'], config);

    http.get.mockResolvedValue({
      body: {
        version: '2.2.1-next.22',
        baseDir: 'test-cli',
        channel: 'next',
        gz: 'https://test-cli-oclif.s3.amazonaws.com/test-cli-v2.2.1-next.22/test-cli-v2.2.1-next.22.tar.gz',
      },
    });

    await commandInstance.run();

    expect(commandInstance.downloadAndExtract).toBeCalled();
    expect(commandInstance.updatedVersion).toBe('2.2.1-next.22');
  });

  it('when requesting a version already available locally, will call updateToExistingVersion', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any);
    commandInstance = new MockedInstallCommand(['1.0.0-next.3'], config);
    await commandInstance.run();

    expect(commandInstance.updateToExistingVersion).toBeCalled();
    expect(commandInstance.downloadAndExtract).not.toBeCalled();
    expect(commandInstance.updatedVersion).toBe('1.0.0-next.3');
  });

  // To do: find out why this one throws "You are trying to import a file after the Jest environment has been torn down" error
  it.skip('will handle an invalid version request', async () => {
    config.pjson.oclif.update.s3.host = 'https://test-cli-oclif.com/';
    mockFs.readdirSync.mockReturnValue([] as any);
    commandInstance = new MockedInstallCommand(['2.2.1'], config);

    let err;

    try {
      http.get.mockRejectedValue(new Error('unable to find version'));
      await commandInstance.run();
    } catch (error) {
      err = error;
    }

    expect(err.message).toBe('unable to find version');
  });

  it('will handle an invalid channel request', async () => {
    config.pjson.oclif.update.s3.host = 'https://test-cli-oclif.com/';
    mockFs.readdirSync.mockReturnValue([] as any);
    commandInstance = new MockedInstallCommand(['test'], config);
    let err;

    try {
      await commandInstance.run();
    } catch (error) {
      err = error;
    }

    expect(commandInstance.downloadAndExtract).not.toBeCalled();
    expect(err.message).toBe(
      'Invalid argument provided: test. Please specify either a valid channel (alpha, beta, next, stable) or an explicit version (ex. 2.68.13)',
    );
  });
});
