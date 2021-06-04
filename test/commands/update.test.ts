import UpdateCommand from '../../src/commands/update';
import * as fs from 'fs';
import { mocked } from 'ts-jest/utils';
import { IConfig } from '@oclif/config';

const mockFs = mocked(fs, true);

class MockedUpdateCommand extends UpdateCommand {
  constructor(a: string[], v: IConfig) {
    super(a, v);
    this.fetchManifest = jest.fn();
    this.downloadAndExtract = jest.fn();
  }
}

describe('Update Command', () => {
  let commandInstance: MockedUpdateCommand;
  let config: IConfig;
  beforeEach(() => {
    mockFs.existsSync.mockReturnValue(true);

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
    } as any;
  });

  it.skip('will run an update', async () => {
    commandInstance = new MockedUpdateCommand([], config);

    await commandInstance.run();
  });

  it.todo('Will update to the current channel when no options are provided');
  it.todo('Will update to a new channel when provided in args');
});
