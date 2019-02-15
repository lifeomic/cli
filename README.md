# CLI

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/lifeomic/cli.svg?branch=master)](https://travis-ci.org/lifeomic/cli)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lifeomic/cli)

This [command line interface][CLI] provides functionality offered by
[LifeOmic](https://lifeomic.com)'s Precision Health Cloud APIs inside an
interactive terminal or in a scripted environment.

![CLI Demo](https://raw.githubusercontent.com/lifeomic/cli/master/cli-demo.svg?sanitize=true)

## Installation

Install via `npm` or `yarn`:

```bash
npm install -g @lifeomic/cli

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

### API Keys

If you wish to use an API key, then you need to create an API key
[here](https://apps.us.lifeomic.com/phc/account) or from `lo api-keys-create`.
Be sure to capture the value of the API key when it is created as you will not
be able to retrieve the value after the first attempt. Run `lo setup` and choose
'Y' to use an API key and provide the API key value.

### SSO

If you wish to use SSO, then you need to create a custom authentication client
[here](https://apps.us.lifeomic.com/phc/account/accounts/clients) and configure
your SAML 2.0 identity provider.  For the callback URL on the authentication
client, be sure to add `http://localhost:8787`.  Then run `lo setup` again and
choose 'Y' to use a custom authentication client and provide the client ID and
secret (if a private client was created).  When running `lo auth` again, a
browser should open and be redirected to the identity provider being used for
SSO.

## Usage

```bash
lo <command> [options]
```

`lo` offers many commands and those can be displayed by using the `-h / --help`
command line option.  For example:

```bash
❯ lo --help

  Usage: lo <command> [options]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    accounts [options]                 List accounts
    accounts-get [options] <account>   Fetch an account
    ...
    </abbreviated>
```

Get help for a specific command:

```bash
❯ lo <command> --help

❯ lo tasks --help

  Usage: tasks [options] <datasetId>

  List tasks

  Options:

    -a, --account <account>            Override the default LifeOmic account
    --json                             Print output as JSON
    --prefix <prefix>                  Filter tasks where the name begins with a prefix
    --state <state>                    Filter tasks by state
    --view <view>                      Specify MINIMAL to just get task state
    --page-size <pageSize>             Number of items to return (default: 25)
    --next-page-token <nextPageToken>  Next page token
    -h, --help                         output usage information
```

[cli]: https://en.wikipedia.org/wiki/Command-line_interface "Command-line interface"
