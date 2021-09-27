describe('Node Version validation', () => {
  it(`Can require install in Node ${process.versions.node}`, () => {
    require('../../lib/commands/install');
  });

  it(`Can require update in Node ${process.versions.node}`, () => {
    require('../../lib/commands/update');
  });

  it(`Can require use in Node ${process.versions.node}`, () => {
    require('../../lib/commands/use');
  });
});
