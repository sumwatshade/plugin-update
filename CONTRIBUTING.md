# Contributing

Suggestions and improvements are always welcome!

## Expectations Before Contributing

Please create a GitHub issue on this repository, so we can discuss your use case or improvement request to ensure that we are aligned and there won't be any unexpected consequences of your proposed modifications.

## How to Contribute

Once we have agreed on a path forward, please for the repository and perform your development. Oclif provides [this guide](https://oclif.io/docs/plugins) describing how Oclif plugins work within their ecosystem, and also include [the plugin-plugins utility](https://github.com/oclif/plugin-plugins) which can be included within the target CLI. Our developer workflow looks like this:

- Install modules for this package via `yarn`
- Build the TS package via `yarn build`
- Run `my-cli plugins:link` at the root of this package. This will associate this local plugin with your CLI tool
- During local development, run `yarn tsc --watch` within a terminal to have changes be immediately reflected in the build
- Verify functionality by running your CLI



We suggest that you work off a branch in your forked repository and submit a pull request from your branch, allowing you to always keep your forked default branch in sync with the origin repository's default branch. Once you have made modification to the source, please also write an equivalent unit test that asserts on the added functionality or bugfix.

You can expect to receive a code review for your contribution within 2 weeks. Please contact a Maintainer or Trusted Committer if you experience any undue delays.

Once all code review comments have been addressed, the PR can be merged into the default branch.

## Expectations After Contributing

Once your PR has been merged to the default branch, the new publish should be available immediately as a new release of the NPM package.