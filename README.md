<!-- Project Logo and Title -->
<p align="center">
  <a href="#">
    <img src=".github/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">@sumwatshade/oclif-plugin-update</h3>
</p>


A fork of @oclif/plugin-update that mimics an [NVM](https://github.com/nvm-sh/nvm)-like experience

[![Version](https://img.shields.io/npm/v/@sumwatshade/oclif-plugin-update.svg)](https://npmjs.org/package/@sumwatshade/oclif-plugin-update)
![CI Job](https://github.com/sumwatshade/plugin-update/actions/workflows/ci.yml/badge.svg)
![Release Job](https://github.com/sumwatshade/plugin-update/actions/workflows/npm-publish.yml/badge.svg)
[![Downloads/week](https://img.shields.io/npm/dw/@sumwatshade/oclif-plugin-update.svg)](https://npmjs.org/package/@sumwatshade/oclif-plugin-update)
[![License](https://img.shields.io/npm/l/@sumwatshade/oclif-plugin-update.svg)](https://github.com/sumwatshade/plugin-update/blob/master/package.json)

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#features">Features</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

## Features

- Quickly switch between different versions of your CLI
- Request explicit installation of a particular version of the tool
- Will use the nearest major/minor/patch based on semantic versioning (ex. `use 3.1` will resolve to latest patch version `3.1.x` available locally)

## Usage

<!-- commands -->
* [`oclif-example install VERSION`](#oclif-example-install-version)
* [`oclif-example update [CHANNEL]`](#oclif-example-update-channel)
* [`oclif-example use [VERSION]`](#oclif-example-use-version)

## `oclif-example install VERSION`

Install and link a new version of the oclif-example CLI. This will first check locally before fetching from the internet

```
USAGE
  $ oclif-example install VERSION

ARGUMENTS
  VERSION  Specify an explicit version (ex. 3.0.0-next.1) or a channel (ex. alpha)
```

_See code: [src/commands/install.ts](https://github.com/sumwatshade/plugin-update/blob/v1.9.4/src/commands/install.ts)_

## `oclif-example update [CHANNEL]`

Updates the oclif-example CLI. This will check for the latest version available on the requested channel and fetch it from remote

```
USAGE
  $ oclif-example update [CHANNEL]

ARGUMENTS
  CHANNEL  Specify a channel (ex: stable,alpha,beta,next). An error will be thrown if this channel is invalid.

OPTIONS
  --from-local  interactively choose an already installed version
```

_See code: [src/commands/update.ts](https://github.com/sumwatshade/plugin-update/blob/v1.9.4/src/commands/update.ts)_

## `oclif-example use [VERSION]`

Checks for a previously installed version of the oclif-example CLI. Throws an error if the version is not found.

```
USAGE
  $ oclif-example use [VERSION]

ARGUMENTS
  VERSION  Specify an explicit version (ex. 3.0.0-next.1) or a channel (ex. alpha)
```

_See code: [src/commands/use.ts](https://github.com/sumwatshade/plugin-update/blob/v1.9.4/src/commands/use.ts)_
<!-- commandsstop -->

## Contributing

Contributions are welcome, please see the [CONTRIBUTING.md](CONTRIBUTING.md) for details.