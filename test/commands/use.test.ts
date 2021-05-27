import UseCommand from '../../src/commands/use'
import * as fs from 'fs'
import {mocked} from 'ts-jest/utils'
import {IConfig} from '@oclif/config'

const mockFs = mocked(fs, true)
class MockedUseCommand extends UseCommand {
  public fetchManifest = jest.fn()

  public downloadAndExtract = jest.fn()
}

describe('Use Command', () => {
  let commandInstance: MockedUseCommand
  let config: IConfig
  beforeEach(() => {
    mockFs.existsSync.mockReturnValue(true)

    config = {
      name: 'test',
      version: '',
      channel: '',
      cacheDir: '',
      commandIDs: [''],
      topics: [],
      valid: true,
      arch: 'arm64',
      platform: 'darwin',
      plugins: [],
      commands: [],
      configDir: '',
      pjson: {} as any,
      root: '',
      bin: '',
    } as any
  })

  it.skip('will run an update', async () => {
    commandInstance = new MockedUseCommand([], config)
    await commandInstance.run()
  })

  it.todo('when provided a channel, uses the latest version available locally')
  it.todo('when provided a version, will directly switch to it locally')
  it.todo('will print a warning when the requested static version is not available locally')
  it.todo('will print a warning when the requested channel is not available locally')
})
