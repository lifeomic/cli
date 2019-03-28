# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic
Versioning](http://semver.org/spec/v2.0.0.html).

## [6.15.4] - 2018-03-28

#### Fixed

- Added more error checking and request retries around `lo files upload`.

## [6.15.3] - 2018-03-27

#### Fixed

- Improved the usability of `lo setup` and `lo auth` by improving some of
  the prompts and available choices to make things more obvious.

## [6.15.2] - 2018-03-22

#### Fixed

- Add retries for requests issued with `lo files upload`

## [6.15.1] - 2018-03-14

#### Fixed

- `lo fhir list` will now properly handle tag queries using `--query`

## [6.15.0] - 2018-02-28

#### Added

- `lo fhir ingest` will now retry HTTP 429 (too many requests) errors

## [6.14.0] - 2018-02-20

#### Added

- Added `--indexed-date` option to `genomics create-genomic-set`,
  `create-foundation-xml-import`, and `create-nantomics-vcf-import`

- Added `files ls` command for browsing files within a project with folder
  support

## [6.13.0] - 2018-12-21

#### Added

- Added `--move-after-upload` option to `files upload`

## [6.12.0] - 2018-12-03

#### Added

- Added `status` options to the genomics commands

## [6.11.0] - 2018-10-25

#### Added

- Added `test-type` and `performer-id` options to the genomics commands

## [6.10.0] - 2018-10-25

#### Added

- Added Content-MD5 checks for s3 file uploads

#### Fixed

- Renamed the `--dataset` option on `lo fhir ingest` to `--project`
  to match the other `fhir` commands.

- Added retries on `5xx` errors to the `fhir` commands.

## [6.9.0] - 2018-10-12

#### Added

- Added `--sequence-name` option to `create-foundation-xml-import` command

## [6.8.0] - 2018-10-11

#### Added

- Added `--sequence-type` option to `create-genomic-set` command

## [6.7.0] - 2018-10-02

#### Added

- Added support for managing and using cohorts

#### Fixed

- `lo fhir get` now prints the the FHIR resource rather than `null`

## [6.6.0] - 2018-09-24

#### Changed

- `lo tasks create-nantomics-vcf-import` - removed report file name argument
  and replaced with file prefix.

## [6.5.0] - 2018-09-14

#### Added

- Added new options for `create-nantomics-vcf-import`

## [6.4.0] - 2018-09-13

#### Changed

- `lo tasks create-foundation-xml-import` - removed report file name argument
  and replaced with file id.

## [6.3.0] - 2018-08-24

#### Added

- Added `create-nantomics-vcf-import`

## [6.2.0] - 2018-08-24

#### Changed

- Project id is now a required argument to the `lo fhir ingest` command.

## [6.1.3] - 2018-08-23

#### Fixed

- Fixed `lo accounts list` command.

## [6.1.2] - 2018-08-20

#### Fixed

- Properly handle errors for `lo fhir ingest` by stopping the ingest at the
  first error.

## [6.1.1] - 2018-08-17

#### Fixed

- Prevent `lo fhir ingest` from doing parallel POST requests and causing rate
  limiting and other issues.

## [6.1.0] - 2018-08-17

#### Added

- Added `create-foundation-xml-import`

## [6.0.2] - 2018-08-13

#### Fixed

- Fixed `lo setup` to add back missing API key options.

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
