# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic
Versioning](http://semver.org/spec/v2.0.0.html).

## [6.0.0] - 2018-08-10

#### Changed

- This releases changes the entire command structure.  Commands like `lo
  files-list` are now `lo files list`.  You can new view help like so: `lo
  --help`, `lo <command> --help`, `lo <command> <subcommand> --help`.

- `fhir ingest' command supports json-lines and will stream and batch the
  resources so it can support arbitrarily large ingests.

## [5.10.0] - 2018-08-08

#### Changed

- FHIR commands now request strict handling which makes the FHIR server do
  strict validation on ingest and searches

## [5.9.1] - 2018-08-06

#### Fixed

- Fixed `lo files-upload` to make it work better for larger files.

## [5.8.0] - 2018-07-31

## [5.9.0] - 2018-08-03

#### Added

- Added `api-keys` commands and the ability to use an API key for authentication

- Added `--id` option to file-upload

## [5.8.0] - 2018-07-31

#### Added

- Added `--delete-after-upload` option to `files-upload`

### Changed

- Updated `files-upload` to ignore "file already uploaded" errors instead of
  throwing

## [5.7.0] - 2018-07-26

#### Added

- Added `lo ga4gh-genomicsets-create`.

## [5.5.0] - 2018-07-25

#### Added

- Added option to use SSO when `lo auth` by specifying a custom auth client with
  `lo setup`.

## [5.4.0] - 2018-06-26

#### Added

- Added `--reference` option to `ga4gh-variantset-create` and
  `ga4gh-readgroupset-create` commands.

## [5.3.0] - 2018-06-26

#### Added

- Added `fhir-search-delete` command for bulk deleting.
- Removed `fhir-delete-all` command.

## [5.2.1] - 2018-06-25

#### Added

- Fixed issue with the `auth` action in the Linux executable.

## [5.2.0] - 2018-06-25

#### Added

- Added executables to release artifacts.

## [5.1.0] - 2018-06-19

#### Added

- Added `auth --set` command option to manually set the access token.

## [5.0.0] - 2018-05-22

### Removed

- Dataset commands

### Added

- Project commands, which replace dataset commands

## [4.2.0] - 2018-04-26

### Fixed

- Use POST based searching for FHIR searches.

## [4.1.0] - 2018-04-05

### Added

- Optimized bulk/batch ingest for fhir-ingest

## [4.0.2] - 2018-03-30

### Fixed

- Better error message when using 'auth' command with client credentials

## [4.0.0] - 2018-03-23

### Added

- Public release

### Fixed

- Better error message when using 'auth' command with client credentials

## [3.2.0] - 2018-03-21

### Added

- Commands for Attribute Based Access Control policies and groups.

## [3.1.0] - 2018-03-12

### Added

- Commands for task resources

## [2.5.1] - 2018-01-19

### Fixed

- The `lo fhir` `--limit` option will not set pageSize when requesting resources

## [2.5.0] - 2018-01-15

### Added

- Commands for FHIR resources

## [2.4.2] - 2018-01-12

### Fixed

- `lo auth -c` now produces an error message if a clip board utility isn't
  installed
- `lo auth` no longer hangs for 1 minute

## [2.4.1] - 2018-01-04

### Fixed

- Changed `files-download` to work with new download response.

## [2.4.0] - 2018-01-04

### Added

- Added support for GA4GH RNA Quantification sets.

## [2.3.1] - 2018-01-03

### Fixed

- Throw a proper error when `setup` has not been performed.

## [2.3.0] - 2018-01-02

### Changed

- The `auth` command was changed to perform authentication using the web login
  view.

## [2.2.0] - 2017-12-21

### Added

- Commands for GA4GH resources

## [2.1.0] - 2017-12-21

### Added

- Support to specify client credential settings in the `setup` command
- Ability to automatically refresh access tokens on expiration

## [2.0.0] - 2017-12-20

### Added

- Added a `--copy` option to the `auth` command to copy the access token to the
  clipboard

### Changed

- Replaced the `defaults` command with a `setup` command
