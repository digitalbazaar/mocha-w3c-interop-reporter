# @digitalbazaar/mocha-w3c-interop-reporter ChangeLog

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
