import InstallCommand from '../../src/commands/install'
import * as fs from 'fs-extra'
import {mocked} from 'ts-jest/utils'
import {IConfig} from '@oclif/config'

jest.mock('fs-extra')
jest.mock('http-call', () => ({
  HTTP: {
    get: jest.fn(),
  },
}))
const mockFs = mocked(fs, true)

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
  let commandInstance: MockedInstallCommand
  let config: IConfig
  const {HTTP: http} = require('http-call')
  beforeEach(() => {
    mockFs.existsSync.mockReturnValue(true);

    config = {
      name: 'test',
      version: '1.0.0',
      channel: 'stable',
      cacheDir: '',
      commandIDs: [''],
      runHook: jest.fn(),
      topics: [],
      valid: true,
      arch: 'arm64',
      platform: 'darwin',
      plugins: [],
      commands: [],
      configDir: '',
      dataDir: '',
      root: '',
      bin: 'cli',
      binPath: 'cli',
      pjson: {oclif: {update: {s3: './folder'}}},
      scopedEnvVar: jest.fn(),
      scopedEnvVarKey: jest.fn(),
      scopedEnvVarTrue: jest.fn(),
      s3Url: () => null,
      s3Key: jest.fn(),
    } as any
  })

  it('when requesting a channel, will fetch manifest to install the latest version', async () => {
    mockFs.readdirSync.mockReturnValue([] as any)
    commandInstance = new MockedInstallCommand(['next'], config)

    http.get.mockResolvedValue({body: {
      version: '1.0.0',
      baseDir: 'test-cli',
      channel: 'next',
      gz: 'https://test-cli-oclif.s3.amazonaws.com/test-cli-v1.0.0/test-cli-v1.0.0.tar.gz',
      xz: 'https://test-cli-oclif.s3.amazonaws.com/test-cli-v1.0.0/test-cli-v1.0.0.tar.xz',
      sha256gz: 'cae9de53d3cb9bfdb43b5fd75b1d9f4655e07cf479a8d86658155ff66d618dbb',
      node: {
        compatible: '>=10',
        recommended: '10.24.0',
      },
    }})

    await commandInstance.run()

    expect(commandInstance.downloadAndExtract).toBeCalled()
    expect(commandInstance.updatedVersion).toBe('next')
  })

  it('when requesting a version, will return the explicit version with appropriate URL', async () => {
    mockFs.readdirSync.mockReturnValue([] as any)
    commandInstance = new MockedInstallCommand(['2.2.1'], config)

    http.get.mockResolvedValue({body: {
      version: '2.2.1',
      baseDir: 'test-cli',
      channel: 'next',
      gz: 'https://test-cli-oclif.s3.amazonaws.com/test-cli-v2.2.1/test-cli-v2.2.1.tar.gz',
      xz: 'https://test-cli-oclif.s3.amazonaws.com/test-cli-v2.2.1/test-cli-v2.2.1.tar.xz',
      sha256gz: 'cae9de53d3cb9bfdb43b5fd75b1d9f4655e07cf479a8d86658155ff66d618dbb',
      node: {
        compatible: '>=10',
        recommended: '10.24.0',
      },
    }})

    await commandInstance.run()

    expect(commandInstance.downloadAndExtract).toBeCalled()
    expect(commandInstance.updatedVersion).toBe('2.2.1')
  })

  it('when requesting a version already available locally, will call updateToExistingVersion', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any)
    commandInstance = new MockedInstallCommand(['1.0.0-next.3'], config)
    await commandInstance.run()

    expect(commandInstance.updateToExistingVersion).toBeCalled()
    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(commandInstance.updatedVersion).toBe('1.0.0-next.3')
  })

  it('will handle an invalid version request', async () => {
    mockFs.readdirSync.mockReturnValue([] as any)
    commandInstance = new MockedInstallCommand(['2.2.1'], {...config, scopedEnvVarTrue: () => false})
    http.get.mockRejectedValue(new Error('unable to find version'))

    let err

    try {
      await commandInstance.run()
    } catch (error) {
      err = error
    }

    expect(err.message).toBe('unable to find version')
  })

  it('will handle an invalid channel request', async () => {
    mockFs.readdirSync.mockReturnValue([] as any)
    commandInstance = new MockedInstallCommand(['2.2.1'], {...config, scopedEnvVarTrue: () => true})

    http.get.mockRejectedValue({statusCode: 403})

    let err

    try {
      await commandInstance.run()
    } catch (error) {
      err = error
    }

    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(err.message).toBe('HTTP 403: Invalid channel undefined')
  })
})
