# cli

[![Greenkeeper
badge](https://badges.greenkeeper.io/lifeomic/lifeomic-cli.svg)](https://greenkeeper.io/)
[![Build
Status](https://travis-ci.org/lifeomic/cli.svg?branch=master)](https://travis-ci.org/lifeomic/cli)

This project is a small CLI app that provides functionality around the LifeOmic
API's.

## Installation

Install via `npm` or `yarn`:

```bash
npm install -g @lifeomic/cli
```

```bash
yarn global add @lifeomic/cli
```

or you can download and install the binary from the [latest
release](https://github.com/lifeomic/cli/releases).

## Configuration

Run `lo setup` to configure the default environment and account you wish to use.
You can later override the default account using the `-a` option for commands.


## Authentication

Use `lo auth` to obtain access credentials when using username / password
authentication.  A browser will be opened and you can enter your credentials in
the LifeOmic login view.

You can also use the client credentials grant flow for obtaining access tokens.
To do this, create a custom authentication client
[here](https://apps.us.lifeomic.com/phc/account/accounts/clients) and be sure to
select the `Client credentials` flow under the `Allowed OAuth Flows` section.
Run `lo setup` again and choose `Y` to use a custom authentication client and
enter the client ID and secret and then choose `Y` again to use client
credentials for authentication. Note that for this option, you do not need to
run `lo auth` as username and password credentials are not used for this
credentials grant.

### SSO

If you wish to use SSO, then you need to create a custom authentication client
[here](https://apps.us.lifeomic.com/phc/account/accounts/clients) and configure
your SAML 2.0 identity provider.  For the callback URL on the authentication
client, be sure to add `http://localhost:8787`.  Then run `lo setup` again and
choose 'Y' to use a custom authentication client and provide the client ID and
secret (if a private client was created).  When running `lo auth` again, a
browser should open and be redirected to the identity provider being used for
SOO.

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
