# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [12.1.1] - 2020-11-20

### Fixed

- Fixed the `genomics list-tests` command to list tests by project using the `--limit` option.


## [12.1.0] - 2020-11-03

### Changed

- Updated the `genomics list-tests` command to list tests by project by leaving off the `[subjectId]` parameter.

## [12.0.0] - 2020-10-08

### Changed

- Updated `lo ocr` sub commands:
  - Removed `delete-document`, `get-document` and `list-documents`. These operations can be performed using `fhir` and `fhir-search` commands.
  - Updated `create-config` to read configuration from JSON file

## [11.9.0] - 2020-10-02

### Changed

- Replaced the `pass-filter` option in the `genomics create-genomic-set` command with `pass-only`.

## [11.8.1] - 2020-09-22

### Fixed

- Fixed issue with 11.8.0 release.

## [11.8.0] - 2020-09-21

### Added

- Added a new `lo genomics update-test` command to update a genomic test.

## [11.7.0] - 2020-09-10

### Added

- Added an optional argument `--output-project-folder` to the
`lo workflows create <datasetId>` command that allows for specifying the
folder within PHC that the workflow should push all output files.

### Fixed

- Corrected the argument `workflow-dependencies-file-ids` in
the `lo workflows create <datasetId>` to be optional instead of required

## [11.6.0] - 2020-08-07

### Added

- Added a `lo tasks retry <taskId>` command.

## [11.5.0] - 2020-08-03

### Added

- Added a `lo genomics get-test` command.
- Addded ablity to read `lo fhir sql` statement from stdin.

## [11.4.0] - 2020-07-06
### Added
- Added a `lo ocr` command set with the following sub commands:
  - Configuration:
    - `lo ocr create-config` Create OCR configuration for a project
    - `lo ocr delete-config` Delete an OCR configuration
    - `lo ocr get-config` Fetch configuration information for a project
  - OCR documents:
    - `lo ocr create-document` Create an OCR-document (starts OCR pipeline)
    - `lo ocr delete-document` Delete an OCR document
    - `lo ocr get-document` Fetch OCR document
    - `lo ocr list-documents` List OCR documents in a project

## [11.3.0] - 2020-06-25

### Added

- Added a `lo tasks create-nantomics-bulk-import` command.

## [11.2.0] - 2020-06-22

### Added

- Upgraded project dependencies.

## [11.1.0] - 2020-06-05

### Added

- Added a `surveys export-responses` command to export the responses for a survey in CSV format.

## [11.0.0] - 2020-05-11

### Changed

- Updated the workflows commands sets to use the new workflows api, this includes removing `workflows` from the command and updating the arguments.  Refer to help on the individual commands for more details
- Updated the `create-*` ingest commands to validate that the optional date provided is in an ISO standard format.

### Removed

- The `workflow-template` and `workflow-parameter` command sets were removed.  This functionality is now covered by the updated workflows commands

## [10.3.0] - 2020-04-20

### Changed

- Replaced TravisCI build with Github Actions.

## [10.2.0] - 2020-03-06

### Added

- Added a `body-site` options to the `genomics` creat set commands.

## [10.1.0] - 2020-03-05

### Added

- Added a `sequence-id` option to the `genomics create-genomic-set` command.

## [10.0.2] - 2020-03-04

### Fixed

- Force `fsevents` dependency bump to avoid node-pregyp error noise on install
- Fix bin links so `lo` is available in path after install

## [10.0.1] - 2020-02-27

### Added

- Support double-click of `life-export` on MacOS.

## [10.0.0] - 2020-02-26

### Added

- Created `life-export` / `life-export.exe` and added it to the [release](https://github.com/lifeomic/cli/releases) archive bundles.  This command allows a user to extract their LIFE data in one step after authenticating with their credentials.

## [9.15.0] - 2020-02-18

### Added

- Added storage of ID token from `lo auth` command.

## [9.14.3] - 2020-02-12

### Added

- Added `fhir me` command for getting one's own FHIR Patient records.

## [9.14.2] - 2020-02-12

### Fixed

- Fixed the alias for the `rgel-file` option to be `f` in `lo genomics create-rna-quantification-set` to keep it from conflicting with other options.

## [9.14.1] - 2020-02-05

### Added

- Fixed a big in the `lo genomics list...` commands in which using the `-l` option was throwing an error
- Updated help information in the `lo genomics list...` commands for `-l` and `-n` to be more descriptive on limits

## [9.14.0] - 2020-02-05

### Added

- Added the `lo genomics create-readgroup-set` command.

## [9.13.1] - 2020-01-27

### Fixed

- Fixed an issue with `lo files mv` and trying to rename files in nested folders.

## [9.13.0] - 2020-01-21

### Added

- Added ability to use auth tokens in the `PHC_ACCESS_TOKEN` and `PHC_REFRESH_TOKEN` environment variables.

## [9.12.0] - 2019-12-09

### Added

- Added missing options to various `lo genomics create-` commands.

## [9.11.0] - 2019-12-04

### Added

- Added `--strip-path` and `--remote-path` to `files upload` command.

## [9.10.0] - 2019-12-04

### Added

- Added the `--send-failed-to` option to the `tasks create-ashion-import`, `tasks create-foundation-xml-import`, and `tasks create-nantomics-vcf-import` commands.

## [9.9.0] - 2019-11-14

### Added

- Added the `--update-sample` option to the `lo genomics create-genomic-set` command.

## [9.8.0] - 2019-11-06

### Added

- Added the following commands to fetch data lake table schemas.
  - `lo data-lake get-schema` Fetch the schema of a single table
  - `lo data-lake list-queries` Fetch the schema of each table

### Updated

- Updated the `query` commands to hit the new `/v1/analytics/data-lake/query` endpoint.

## [9.7.0] - 2019-10-30

### Added

- Added the following commands to issue and fetch the data of queries against the analytics data lake.
  - `lo data-lake query` Submits a query to the Lifeomic data-lake API
  - `lo data-lake get-query` Fetch a single query execution
  - `lo data-lake list-queries` List the query executions in the project

## [9.6.0] - 2019-10-16

### Added

- Added the following commands which allow usage of the new workflow api which implements a subset of the [Common Workflow Language](https://www.commonwl.org) standard
  - Handling of cwl json templates
    - `lo workflows create-template` Add the CWL json template
    - `lo workflows get-template` Returns a CWL json template
    - `lo workflows list-templates` Returns all CWL json templates belonging to a project
    - `lo workflows delete-template` Removes the CWL json template from a project
  - Handling of cwl json parameters
    - `lo workflows create-parameters` Add a CWL json parameter set
    - `lo workflows get-parameters` Returns a CWL json parameter set
    - `lo workflows list-parameters` Returns all CWL json parameter sets belonging to a project
    - `lo workflows delete-parameters` Removes the CWL json parameter set from a project
  - Handling of cwl json parameters
    - `lo workflows build-workflow` Generates and starts a workflow with a combination of a template and parameter resources
    - `lo workflows create-workflow` Allows a full CWL JSON template and parameter set to be read into the command directly
    - `lo workflows get-workflow` Returns a workflow
    - `lo workflows list-workflows` Returns all workflows belonging to a project
    - `lo workflows delete-workflows` Removes the workflow from the project

## [9.5.0] - 2019-10-03

### Added

- Added the following optional argument to the tasks `create-ashion-import`
    - `--re-ingest-file` Allows an Ashion file to be re-ingested

## [9.4.0] - 2019-09-26

### Added

- Added the following optional arguments to the tasks `create-ashion-import`, `create-foundation-xml-import`,
and `create-nantomics-vcf-import`
    - `--body-site` the code indicating the body site of the sample
    - `--body-site-system` the system from which the body site code is derived
    - `--body-site-display` a display value for the body site code

## [9.3.0] - 2019-09-25

### Added

- Added the `lo genomics list-tests` command to lists genomic tests for a subject
- Addded the `lo genomics delete-test` command to delete a test for a subject

## [9.2.0] - 2019-09-09

### Added

- Added the same arguments to the following `genomics` commands: `list-copy-number-sets`, `list-readgroup-sets`,
`list-rna-quantification-sets`, `list-structural-variant-sets` and `list-variant-sets`
  - `--missing-patient` returns sets that are missing patientIds
  - `--missing-sequence` returns sets that are missing sequenceIds
  - `--missing-samples` returns sets that are missing sample names
  - `--missing-fhir-sequence` returns sets that have no associate FHIR Sequence resource
  - `--only-ids` causes the return to be only a an array of ids, intended to help with scripting tasks

## [9.1.0] - 2019-09-06

### Added

- Added the `lo tasks create-ashion-import` command to ingest Ashion test files

## [9.0.0] - 2019-09-05

### Updated

- Updated the `create-foundation-task` and `create-nantomics-task` commands to make the argument `test-type` required instead of optional
- Updated the `genomics` list commands to allow filtering by `sequenceId` or `patientId`

## [8.3.1] - 2019-08-13

### Fixed

- `lo files upload` fixed bug with uploading empty files.

## [8.3.0] - 2019-08-13

### Added

- `lo insights schedule-job` command to schedule Insights rebuild jobs.

## [8.2.1] - 2019-08-10

### Fixed

- `lo` yaml output will now go deeper rather than cutting off at 3 levels deep

## [8.2.0] - 2019-07-24

### Added

- `--re-ingest-file` flag to `lo tasks create-foundation-xml-import` and `lo tasks create-nantomics-vcf-import`. This flag will allow re-ingesting of a file even if a sequence already exists for it.  The current files for the sequence will be overwritten.  ([#101](https://github.com/lifeomic/cli/pull/101))

## [8.1.0] - 2019-07-12

### Added

- `lo genomics create-copy-number-set` kicks off the workflow to start indexing of a CNV/copy number file ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics create-structural-variant-set` kicks off the workflow to start indexing of a FNV/structural variant file ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics delete-copy-number-set` deletes the copy number genomic set for the provided set id ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics delete-structural-variant-set` deletes the structural variant genomic set for the provided set id ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics get-copy-number-set` gets the copy number genomic set for the provided set id ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics get-structural-variant-set` gets the structural variant genomic set for the provided set id ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics list-copy-number-sets` gets the copy number genomic sets for the provided data set id ([#97](https://github.com/lifeomic/cli/pull/97))
- `lo genomics list-structural-variant-sets` gets the structural variant genomic set for the provided data set id ([#97](https://github.com/lifeomic/cli/pull/97))
- `--use-existing-sequence` flag to `lo tasks create-foundation-xml-import` and `lo tasks create-nantomics-vcf-import`. This flag when used with any `--indext-type` besides `all` will attempt to add the currently ingest variant type to an existing sequence.  ([#96](https://github.com/lifeomic/cli/pull/96))
- `lo fhir ingest` now allows for CSV content to be passed to stdin with a `--csv` flag which points to a configuration file. See `examples/csv_input/observations.csv` as an example of input, and `examples/csv_format/csv_observation_input.json` as an example of configuration.  ([#99](https://github.com/lifeomic/cli/pull/99))

## [8.0.3] - 2019-06-24

### Fixed

- `lo` will now no longer colorize YAML output when it is going to a pipe ([#93](https://github.com/lifeomic/cli/pull/93))

## [8.0.2] - 2019-06-24

### Fixed

- `lo auth` will only listen on local interfaces. ([#92](https://github.com/lifeomic/cli/pull/92))

## [8.0.1] - 2019-06-23

### Fixed

- `lo fhir list <type> --json` will once again produce valid JSON (i.e. an array of objects) ([#89](https://github.com/lifeomic/cli/pull/89))

## [8.0.0] - 2019-06-18

### Changed

- `lo genomics create-genomic-set` has new required parameters. ([#88](https://github.com/lifeomic/cli/pull/88))

## [7.6.0] - 2019-05-30

### Added

- `lo files mv <source> <dest>` to allow one to rename a file or a set of files within a project. ([#86](https://github.com/lifeomic/cli/pull/86))

## [7.5.0] - 2019-05-30

### Added

- `lo tasks create-foundation-xml-import` now provides for structural variant ingestion by means of a new value for the `index-type` flag, `fnv`
- `lo tasks create-nantomics-vcf-import` now provides for structural variant ingestion by means of an optional new flag `upload-type` which allows selection of either short variant file or structural variant file

## [7.4.0] - 2018-05-29

### Added

- Added `lo layouts` commands that allow one to manage subject viewer layouts.  ([#80](https://github.com/lifeomic/cli/pull/80) from [@taylordeatri](https://github.com/taylordeatri))
- Added `--jsonLine` global option to use JSON Line format.  ([#80](https://github.com/lifeomic/cli/pull/80) from [@taylordeatri](https://github.com/taylordeatri))
- Added `--csv` option to `lo fhir list` command to output resources as CSV.  ([#80](https://github.com/lifeomic/cli/pull/80) from [@taylordeatri](https://github.com/taylordeatri))

### Fixed

- Upgraded Axios version to fix issue with proxy support when using `https_proxy` environment variable.  ([#80](https://github.com/lifeomic/cli/pull/80) from [@taylordeatri](https://github.com/taylordeatri))

## [7.3.0] - 2018-05-28

### Added

- `lo files download` now provides recrusive download support to allow one to download many files from a project. ([#85](https://github.com/lifeomic/cli/pull/85))

## [7.2.1] - 2018-05-22

### Fixed

- `lo files upload` now properly formats the file names when operating on a Windows OS. ([#83](https://github.com/lifeomic/cli/pull/83))

## [7.2.0] - 2018-05-10

### Added

- `lo setup` now provides support for providing settings using arguments. ([#78](https://github.com/lifeomic/cli/pull/78) from [@bmamlin](https://github.com/bmamlin))

## [7.1.3] - 2018-05-09

### Fixed

- Worked around an issue that was causing `lo auth` to fail when using SAML SSO.

## [7.1.2] - 2018-04-19

### Fixed

- Fixed issue with batching over JSON array type objects with `lo ontologies import`.

## [7.1.1] - 2018-04-18

### Fixed

- Fixed issue with importing JSON array type objects with `lo ontologies import`.

## [7.1.0] - 2018-04-16

### Added

- Added `ontologies import` command for uploading ontologies to a project.

## [7.0.0] - 2018-04-09

### Changed

- Replaced the `page-size` and `next-page-token` options with a `limit` option for the `lo files ls` command.

- Replaced the YAML printer library with one that can handle larger lists

### Added

- Added a `limit` option to the following commands which allows them to fetch as many pages needed to hit the limit:
  `lo files list`, `lo genomics list-variant-sets`, `lo genomics list-readgroup-sets`, and `list-rna-quantification-sets`

## [6.15.5] - 2018-03-29

### Fixed

- Fixed issue with uploading very large files with `lo files upload`.

## [6.15.4] - 2018-03-28

### Fixed

- Added more error checking and request retries around `lo files upload`.

## [6.15.3] - 2018-03-27

### Fixed

- Improved the usability of `lo setup` and `lo auth` by improving some of
  the prompts and available choices to make things more obvious.

## [6.15.2] - 2018-03-22

### Fixed

- Add retries for requests issued with `lo files upload`

## [6.15.1] - 2018-03-14

### Fixed

- `lo fhir list` will now properly handle tag queries using `--query`

## [6.15.0] - 2018-02-28

### Added

- `lo fhir ingest` will now retry HTTP 429 (too many requests) errors

## [6.14.0] - 2018-02-20

### Added

- Added `--indexed-date` option to `genomics create-genomic-set`,
  `create-foundation-xml-import`, and `create-nantomics-vcf-import`

- Added `files ls` command for browsing files within a project with folder
  support

## [6.13.0] - 2018-12-21

### Added

- Added `--move-after-upload` option to `files upload`

## [6.12.0] - 2018-12-03

### Added

- Added `status` options to the genomics commands

## [6.11.0] - 2018-10-25

### Added

- Added `test-type` and `performer-id` options to the genomics commands

## [6.10.0] - 2018-10-25

### Added

- Added Content-MD5 checks for s3 file uploads

### Fixed

- Renamed the `--dataset` option on `lo fhir ingest` to `--project`
  to match the other `fhir` commands.

- Added retries on `5xx` errors to the `fhir` commands.

## [6.9.0] - 2018-10-12

### Added

- Added `--sequence-name` option to `create-foundation-xml-import` command

## [6.8.0] - 2018-10-11

### Added

- Added `--sequence-type` option to `create-genomic-set` command

## [6.7.0] - 2018-10-02

### Added

- Added support for managing and using cohorts

### Fixed

- `lo fhir get` now prints the the FHIR resource rather than `null`

## [6.6.0] - 2018-09-24

### Changed

- `lo tasks create-nantomics-vcf-import` - removed report file name argument
  and replaced with file prefix.

## [6.5.0] - 2018-09-14

### Added

- Added new options for `create-nantomics-vcf-import`

## [6.4.0] - 2018-09-13

### Changed

- `lo tasks create-foundation-xml-import` - removed report file name argument
  and replaced with file id.

## [6.3.0] - 2018-08-24

### Added

- Added `create-nantomics-vcf-import`

## [6.2.0] - 2018-08-24

### Changed

- Project id is now a required argument to the `lo fhir ingest` command.

## [6.1.3] - 2018-08-23

### Fixed

- Fixed `lo accounts list` command.

## [6.1.2] - 2018-08-20

### Fixed

- Properly handle errors for `lo fhir ingest` by stopping the ingest at the
  first error.

## [6.1.1] - 2018-08-17

### Fixed

- Prevent `lo fhir ingest` from doing parallel POST requests and causing rate
  limiting and other issues.

## [6.1.0] - 2018-08-17

### Added

- Added `create-foundation-xml-import`

## [6.0.2] - 2018-08-13

### Fixed

- Fixed `lo setup` to add back missing API key options.

## [6.0.0] - 2018-08-10

### Changed

- This releases changes the entire command structure.  Commands like `lo
  files-list` are now `lo files list`.  You can new view help like so: `lo
  --help`, `lo <command> --help`, `lo <command> <subcommand> --help`.

- `fhir ingest' command supports json-lines and will stream and batch the
  resources so it can support arbitrarily large ingests.

## [5.10.0] - 2018-08-08

### Changed

- FHIR commands now request strict handling which makes the FHIR server do
  strict validation on ingest and searches

## [5.9.1] - 2018-08-06

### Fixed

- Fixed `lo files-upload` to make it work better for larger files.

## [5.9.0] - 2018-08-03

### Added

- Added `api-keys` commands and the ability to use an API key for authentication

- Added `--id` option to file-upload

## [5.8.0] - 2018-07-31

### Added

- Added `--delete-after-upload` option to `files-upload`

### Changed

- Updated `files-upload` to ignore "file already uploaded" errors instead of
  throwing

## [5.7.0] - 2018-07-26

### Added

- Added `lo ga4gh-genomicsets-create`.

## [5.5.0] - 2018-07-25

### Added

- Added option to use SSO when `lo auth` by specifying a custom auth client with
  `lo setup`.

## [5.4.0] - 2018-06-26

### Added

- Added `--reference` option to `ga4gh-variantset-create` and
  `ga4gh-readgroupset-create` commands.

## [5.3.0] - 2018-06-26

### Added

- Added `fhir-search-delete` command for bulk deleting.
- Removed `fhir-delete-all` command.

## [5.2.1] - 2018-06-25

### Added

- Fixed issue with the `auth` action in the Linux executable.

## [5.2.0] - 2018-06-25

### Added

- Added executables to release artifacts.

## [5.1.0] - 2018-06-19

### Added

- Added `auth --set` command option to manually set the access token.

## [5.0.0] - 2018-05-22

### Removed

- Dataset commands

### Added

- Project commands, which replace dataset commands

## 4.2.0 - 2018-04-26

### Fixed

- Use POST based searching for FHIR searches.

## 4.1.0 - 2018-04-05

### Added

- Optimized bulk/batch ingest for fhir-ingest

## 4.0.2 - 2018-03-30

### Fixed

- Better error message when using 'auth' command with client credentials

## 4.0.0 - 2018-03-23

### Added

- Public release

### Fixed

- Better error message when using 'auth' command with client credentials

## 3.2.0 - 2018-03-21

### Added

- Commands for Attribute Based Access Control policies and groups.

## 3.1.0 - 2018-03-12

### Added

- Commands for task resources

## 2.5.1 - 2018-01-19

### Fixed

- The `lo fhir` `--limit` option will not set pageSize when requesting resources

## 2.5.0 - 2018-01-15

### Added

- Commands for FHIR resources

## 2.4.2 - 2018-01-12

### Fixed

- `lo auth -c` now produces an error message if a clip board utility isn't
  installed
- `lo auth` no longer hangs for 1 minute

## 2.4.1 - 2018-01-04

### Fixed

- Changed `files-download` to work with new download response.

## 2.4.0 - 2018-01-04

### Added

- Added support for GA4GH RNA Quantification sets.

## 2.3.1 - 2018-01-03

### Fixed

- Throw a proper error when `setup` has not been performed.

## 2.3.0 - 2018-01-02

### Changed

- The `auth` command was changed to perform authentication using the web login
  view.

## 2.2.0 - 2017-12-21

### Added

- Commands for GA4GH resources

## 2.1.0 - 2017-12-21

### Added

- Support to specify client credential settings in the `setup` command
- Ability to automatically refresh access tokens on expiration

## 2.0.0 - 2017-12-20

### Added

- Added a `--copy` option to the `auth` command to copy the access token to the
  clipboard

### Changed

- Replaced the `defaults` command with a `setup` command

[12.1.1]: https://github.com/lifeomic/cli/compare/v12.1.0...v12.1.1
[12.1.0]: https://github.com/lifeomic/cli/compare/v12.0.0...v12.1.0
[12.0.0]: https://github.com/lifeomic/cli/compare/v11.9.0...v12.0.0
[11.9.0]: https://github.com/lifeomic/cli/compare/v11.8.1...v11.9.0
[11.8.1]: https://github.com/lifeomic/cli/compare/v11.8.0...v11.8.1
[11.8.0]: https://github.com/lifeomic/cli/compare/v11.7.0...v11.8.0
[11.7.0]: https://github.com/lifeomic/cli/compare/v11.6.0...v11.7.0
[11.6.0]: https://github.com/lifeomic/cli/compare/v11.5.0...v11.6.0
[11.5.0]: https://github.com/lifeomic/cli/compare/v11.4.0...v11.5.0
[11.4.0]: https://github.com/lifeomic/cli/compare/v11.3.0...v11.4.0
[11.3.0]: https://github.com/lifeomic/cli/compare/v11.2.0...v11.3.0
[11.2.0]: https://github.com/lifeomic/cli/compare/v11.1.0...v11.2.0
[11.1.0]: https://github.com/lifeomic/cli/compare/v11.0.0...v11.1.0
[11.0.0]: https://github.com/lifeomic/cli/compare/v10.3.0...v11.0.0
[10.3.0]: https://github.com/lifeomic/cli/compare/v10.2.0...v10.3.0
[10.2.0]: https://github.com/lifeomic/cli/compare/v10.1.0...v10.2.0
[10.1.0]: https://github.com/lifeomic/cli/compare/v10.0.2...v10.1.0
[10.0.2]: https://github.com/lifeomic/cli/compare/v10.0.1...v10.0.2
[10.0.1]: https://github.com/lifeomic/cli/compare/v10.0.0...v10.0.1
[10.0.0]: https://github.com/lifeomic/cli/compare/v9.15.0...v10.0.0
[9.15.0]: https://github.com/lifeomic/cli/compare/v9.14.3...v9.15.0
[9.14.3]: https://github.com/lifeomic/cli/compare/v9.14.2...v9.14.3
[9.14.2]: https://github.com/lifeomic/cli/compare/v9.14.1...v9.14.2
[9.14.1]: https://github.com/lifeomic/cli/compare/v9.14.0...v9.14.1
[9.14.0]: https://github.com/lifeomic/cli/compare/v9.13.1...v9.14.0
[9.13.1]: https://github.com/lifeomic/cli/compare/v9.13.0...v9.13.1
[9.13.0]: https://github.com/lifeomic/cli/compare/v9.12.0...v9.13.0
[9.12.0]: https://github.com/lifeomic/cli/compare/v9.11.0...v9.12.0
[9.11.0]: https://github.com/lifeomic/cli/compare/v9.10.0...v9.11.0
[9.10.0]: https://github.com/lifeomic/cli/compare/v9.9.0...v9.10.0
[9.9.0]: https://github.com/lifeomic/cli/compare/v9.8.0...v9.9.0
[9.8.0]: https://github.com/lifeomic/cli/compare/v9.7.0...v9.8.0
[9.7.0]: https://github.com/lifeomic/cli/compare/v9.6.0...v9.7.0
[9.6.0]: https://github.com/lifeomic/cli/compare/v9.5.0...v9.6.0
[9.5.0]: https://github.com/lifeomic/cli/compare/v9.4.0...v9.5.0
[9.4.0]: https://github.com/lifeomic/cli/compare/v9.3.0...v9.4.0
[9.3.0]: https://github.com/lifeomic/cli/compare/v9.2.0...v9.3.0
[9.2.0]: https://github.com/lifeomic/cli/compare/v9.1.0...v9.2.0
[9.1.0]: https://github.com/lifeomic/cli/compare/v9.0.0...v9.1.0
[9.0.0]: https://github.com/lifeomic/cli/compare/v8.3.1...v9.0.0
[8.3.1]: https://github.com/lifeomic/cli/compare/v8.3.0...v8.3.1
[8.3.0]: https://github.com/lifeomic/cli/compare/v8.2.1...v8.3.0
[8.2.1]: https://github.com/lifeomic/cli/compare/v8.2.0...v8.2.1
[8.2.0]: https://github.com/lifeomic/cli/compare/v8.1.0...v8.2.0
[8.1.0]: https://github.com/lifeomic/cli/compare/v8.0.3...v8.1.0
[8.0.3]: https://github.com/lifeomic/cli/compare/v8.0.2...v8.0.3
[8.0.2]: https://github.com/lifeomic/cli/compare/v8.0.1...v8.0.2
[8.0.1]: https://github.com/lifeomic/cli/compare/v8.0.0...v8.0.1
[8.0.0]: https://github.com/lifeomic/cli/compare/v7.6.0...v8.0.0
[7.6.0]: https://github.com/lifeomic/cli/compare/v7.5.0...v7.6.0
[7.5.0]: https://github.com/lifeomic/cli/compare/v7.4.0...v7.5.0
[7.4.0]: https://github.com/lifeomic/cli/compare/v7.3.0...v7.4.0
[7.3.0]: https://github.com/lifeomic/cli/compare/v7.2.1...v7.3.0
[7.2.1]: https://github.com/lifeomic/cli/compare/v7.2.0...v7.2.1
[7.2.0]: https://github.com/lifeomic/cli/compare/v7.1.3...v7.2.0
[7.1.3]: https://github.com/lifeomic/cli/compare/v7.1.2...v7.1.3
[7.1.2]: https://github.com/lifeomic/cli/compare/v7.1.1...v7.1.2
[7.1.1]: https://github.com/lifeomic/cli/compare/v7.1.0...v7.1.1
[7.1.0]: https://github.com/lifeomic/cli/compare/v7.0.0...v7.1.0
[7.0.0]: https://github.com/lifeomic/cli/compare/v6.15.5...v7.0.0
[6.15.5]: https://github.com/lifeomic/cli/compare/v6.15.4...v6.15.5
[6.15.4]: https://github.com/lifeomic/cli/compare/v6.15.3...v6.15.4
[6.15.3]: https://github.com/lifeomic/cli/compare/v6.15.2...v6.15.3
[6.15.2]: https://github.com/lifeomic/cli/compare/v6.15.1...v6.15.2
[6.15.1]: https://github.com/lifeomic/cli/compare/v6.15.0...v6.15.1
[6.15.0]: https://github.com/lifeomic/cli/compare/v6.14.0...v6.15.0
[6.14.0]: https://github.com/lifeomic/cli/compare/v6.13.0...v6.14.0
[6.13.0]: https://github.com/lifeomic/cli/compare/v6.12.0...v6.13.0
[6.12.0]: https://github.com/lifeomic/cli/compare/v6.11.0...v6.12.0
[6.11.0]: https://github.com/lifeomic/cli/compare/v6.10.0...v6.11.0
[6.10.0]: https://github.com/lifeomic/cli/compare/v6.9.0...v6.10.0
[6.9.0]: https://github.com/lifeomic/cli/compare/v6.8.0...v6.9.0
[6.8.0]: https://github.com/lifeomic/cli/compare/v6.7.0...v6.8.0
[6.7.0]: https://github.com/lifeomic/cli/compare/v6.6.0...v6.7.0
[6.6.0]: https://github.com/lifeomic/cli/compare/v6.5.0...v6.6.0
[6.5.0]: https://github.com/lifeomic/cli/compare/v6.4.0...v6.5.0
[6.4.0]: https://github.com/lifeomic/cli/compare/v6.3.0...v6.4.0
[6.3.0]: https://github.com/lifeomic/cli/compare/v6.2.0...v6.3.0
[6.2.0]: https://github.com/lifeomic/cli/compare/v6.1.0...v6.2.0
[6.1.3]: https://github.com/lifeomic/cli/compare/v6.1.2...v6.1.3
[6.1.2]: https://github.com/lifeomic/cli/compare/v6.1.1...v6.1.2
[6.1.1]: https://github.com/lifeomic/cli/compare/v6.1.0...v6.1.1
[6.1.0]: https://github.com/lifeomic/cli/compare/v6.0.2...v6.1.0
[6.0.2]: https://github.com/lifeomic/cli/compare/v6.0.0...v6.0.2
[6.0.0]: https://github.com/lifeomic/cli/compare/v5.10.0...v6.0.0
[5.10.0]: https://github.com/lifeomic/cli/compare/v5.9.1...v5.10.0
[5.9.1]: https://github.com/lifeomic/cli/compare/v5.9.0...v5.9.1
[5.9.0]: https://github.com/lifeomic/cli/compare/v5.8.0...v5.9.0
[5.8.0]: https://github.com/lifeomic/cli/compare/v5.7.0...v5.8.0
[5.7.0]: https://github.com/lifeomic/cli/compare/v5.5.0...v5.7.0
[5.5.0]: https://github.com/lifeomic/cli/compare/v5.4.0...v5.5.0
[5.4.0]: https://github.com/lifeomic/cli/compare/v5.3.0...v5.4.0
[5.3.0]: https://github.com/lifeomic/cli/compare/v5.2.1...v5.3.0
[5.2.1]: https://github.com/lifeomic/cli/compare/v5.2.0...v5.2.1
[5.2.0]: https://github.com/lifeomic/cli/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/lifeomic/cli/compare/5.0.0...v5.1.0
[5.0.0]: https://github.com/lifeomic/cli/compare/v4.0.0...5.0.0