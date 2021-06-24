# @sumwatshade/oclif-plugin-update

====================

> A fork of @oclif/plugin-update that closer mimics [NVM](https://github.com/nvm-sh/nvm)

[![Version](https://img.shields.io/npm/v/@oclif/plugin-update.svg)](https://npmjs.org/package/@sumwatshade/oclif-plugin-update)
[![CircleCI](https://circleci.com/gh/oclif/plugin-update/tree/master.svg?style=shield)](https://circleci.com/gh/sumwatshade/plugin-update/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@oclif/plugin-update.svg)](https://npmjs.org/package/@sumwatshade/oclif-plugin-update)
[![License](https://img.shields.io/npm/l/@oclif/plugin-update.svg)](https://github.com/sumwatshade/plugin-update/blob/master/package.json)

<!-- toc -->
* [@sumwatshade/oclif-plugin-update](#sumwatshadeoclif-plugin-update)
<!-- tocstop -->

## Commands

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

_See code: [src/commands/install.ts](https://github.com/sumwatshade/plugin-update/blob/v1.8.6/src/commands/install.ts)_

## `oclif-example update [CHANNEL]`

update the oclif-example CLI. This will download a new binary

```
USAGE
  $ oclif-example update [CHANNEL]

ARGUMENTS
  CHANNEL  Specify a prerelease channel. An error will be thrown if this channel is invalid.

OPTIONS
  --from-local  interactively choose an already installed version
```

_See code: [src/commands/update.ts](https://github.com/sumwatshade/plugin-update/blob/v1.8.6/src/commands/update.ts)_

## `oclif-example use [VERSION]`

Checks for a previously installed version of the oclif-example CLI. Throws an error if the version is not found.

```
USAGE
  $ oclif-example use [VERSION]

ARGUMENTS
  VERSION  Specify an explicit version (ex. 3.0.0-next.1) or a channel (ex. alpha)
```

_See code: [src/commands/use.ts](https://github.com/sumwatshade/plugin-update/blob/v1.8.6/src/commands/use.ts)_
<!-- commandsstop -->
