import InstallCommand from '../../src/commands/use'
import * as fs from 'fs'
import { mocked } from 'ts-jest/utils'
import { IConfig } from '@oclif/config'

const mockFs = mocked(fs, true)

class MockedInstallCommand extends InstallCommand {
    public fetchManifest = jest.fn()

    public downloadAndExtract = jest.fn()
}

describe.skip('Install Command', () => {
    let commandInstance: MockedInstallCommand
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
        commandInstance = new MockedInstallCommand([], config)

        await commandInstance.run()
    })

    it.todo(
        'when requesting a channel, will fetch manifest to install the latest version'
    )
    it.todo(
        'when requesting a version, will return the explicit version with appropriate URL'
    )
    it.todo('will handle an invalid version request')
    it.todo('will handle an invalid channel request')
})
