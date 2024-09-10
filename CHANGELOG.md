# @digitalbazaar/mocha-w3c-interop-reporter ChangeLog

## 1.8.0 - 2024-09-10

### Added
- Skipped tests show either `skipMessage`, error, or `Test Skipped`.

## 1.7.0 - 2024-07-22

### Added
- Improve error message display on mouse over.
- Tests can now provide `this.test.link` to link test names to a destination
  (typically a browser highlight URL: `:~:text=`).

### Changed
- Icon key area now lists all available status icons in the Key section.

## 1.6.0 - 2023-11-27

### Changed
- Update status mark for `pending` from 🛑 to 🚫 and update the corresponding
  error message.

## 1.5.0 - 2023-11-09

### Added
- A new npm binary `npx interopReporter makeReport` for manually creating reports from mocha suites.
- A new reporter option `templateData` that outputs the data used to make the html report as json.

## 1.4.0 - 2023-07-25

### Added
- If an implementation fails to run a test mark the test pending.

### Fixed
- Removed flex justify-center from conformance table to ensure normal spec layout.
- Added centering for implementation names in matrix.

## 1.3.0 - 2022-11-09

### Added
- Add an `:hover` selector to `matrix.hbs` that shows test errors.
- Add a new template option error for displaying test errors.

### Fixed
- Add a NaN check to the percent method.

## 1.2.1 - 2022-05-26

### Fixed
- Fix reporter option so `helpers` file can be passed in.

## 1.2.0 - 2022-05-25

### Added
- Add a new template `abstract.hbs` and set it via `abstract=abstract.hbs`.
- Add a new template `test-statistics.hbs` and set it via `statistics=statistics.hbs`.
- Add a time stamp to test statistics.
- Add a language option so generated dates match language of spec.

### Fixed
- Moved test statistics to the Conformance section instead of Status of this Document.
- Respec Language option allows UTC Datetime stamps to be in any language.

## 1.1.0 - 2022-05-24

### Added
- Add a new helper `{{today}}` usable in templates.

## 1.0.0 - 2022-05-12

### Added
- Add initial release files.
- Add `handlebars` templates for report structure.
- Default `matrix.hbs` display.
- Roll Up module bundler for CommonJS exports.
- Add README with instructions for use.
- See git history for changes previous to this release.
