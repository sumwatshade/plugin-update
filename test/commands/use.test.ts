import UseCommand from '../../src/commands/use'
import * as fs from 'fs-extra'
import {mocked} from 'ts-jest/utils'
import {IConfig} from '@oclif/config'
import {IManifest} from '@oclif/dev-cli'

jest.mock('fs-extra')
const mockFs = mocked(fs, true)
class MockedUseCommand extends UseCommand {
  public channel!: string;

  public clientRoot!: string;

  public currentVersion!: string;

  public updatedVersion!: string;

  public fetchManifest = jest.fn();

  public downloadAndExtract = jest.fn();
}

describe('Use Command', () => {
  let commandInstance: MockedUseCommand
  let config: IConfig
  beforeEach(() => {
    mockFs.existsSync.mockReturnValue(true)

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
      pjson: {} as any,
      root: '',
      bin: 'cli',
      scopedEnvVarKey: jest.fn(),
      scopedEnvVar: jest.fn(),
    } as any
  })

  it('when provided a channel, uses the latest version available locally', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any)

    // oclif-example use next
    commandInstance = new MockedUseCommand(['next'], config)

    commandInstance.fetchManifest.mockResolvedValue({})

    await commandInstance.run()

    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(commandInstance.updatedVersion).toBe('1.0.0-next.3')
  })

  it('when provided a version, will directly switch to it locally', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any)

    // oclif-example use next
    commandInstance = new MockedUseCommand(['1.0.0-alpha.0'], config)

    commandInstance.fetchManifest.mockResolvedValue({
      channel: 'alpha',
    } as IManifest)

    await commandInstance.run()

    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(commandInstance.updatedVersion).toBe('1.0.0-alpha.0')
  })

  it('will print a warning when the requested static version is not available locally', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any)

    // oclif-example use next
    commandInstance = new MockedUseCommand(['1.0.0-alpha.3'], config)

    commandInstance.fetchManifest.mockResolvedValue({})

    let err

    try {
      await commandInstance.run()
    } catch (error) {
      err = error
    }

    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(err.message).toBe('Requested version could not be found. Please try running `cli install 1.0.0-alpha.3`')
  })

  it('will print a warning when the requested channel is not available locally', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any)

    // oclif-example use next
    commandInstance = new MockedUseCommand(['blah'], config)

    commandInstance.fetchManifest.mockResolvedValue({})

    let err

    try {
      await commandInstance.run()
    } catch (error) {
      err = error
    }

    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(err.message).toBe('Requested version could not be found. Please try running `cli install blah`')
  })

  it('when provided a channel, updates the channel even if local versions do not have channel', async () => {
    mockFs.readdirSync.mockReturnValue([
      '1.0.0-next.2',
      '1.0.0-next.3',
      '1.0.1',
      '1.0.0-alpha.0',
    ] as any)

    // oclif-example use next
    commandInstance = new MockedUseCommand(['beta'], config)

    commandInstance.fetchManifest.mockResolvedValue({})

    await commandInstance.run()

    expect(commandInstance.downloadAndExtract).not.toBeCalled()
    expect(commandInstance.channel).toBe('beta')
  })
})
