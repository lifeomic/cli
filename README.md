# cli

[![Greenkeeper badge](https://badges.greenkeeper.io/lifeomic/lifeomic-cli.svg)](https://greenkeeper.io/)

This project is a small CLI app that provides functionality around the LifeOmic
API's.

## Installation

```bash
yarn global add @lifeomic/cli
```

Run `lo setup` to configure the default environment and account you wish to use.
You can later override the default account using the `-a` option for commands.
If using client credentials, you will also be given the opportunity to store the
client settings at this time.

Use `lo auth` to obtain access credentials when using username / password
authentication.  This command currently only supports LifeOmic users and not
those that have been federated via social or SAML 2.0 identity providers.

## Usage

```bash
lo <command> [options]
```

View available commands:

```bash
lo --help
```

Get help for a command:

```bash
lo <command> --help
```
