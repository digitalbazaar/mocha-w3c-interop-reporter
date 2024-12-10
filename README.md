# Mocha W3C Interop Reporter

Is a mocha reporter that creates interoperability matrices in existing W3C documents with ReSpec.

## Installation

Using npm

```bash
npm i --save @digitalbazaar/mocha-w3c-interop-reporter
```

## Usage

The reporter wraps around existing Mocha interfaces such as `describe` and `it`.
```js
describe('Matrix Test', function() {
  // summaries are displayed in the SOTD section after the results
  const summaries = new Set();
  this.summary = summaries;
  // when the report sees a suite with report true it includes it
  this.report = true;
  // this tells the reporter to use the matrix.hbs template to display the results
  this.matrix = true;
  // this gives the names of the implementations that are being tested
  this.implemented = ['foo'];
  // this gives the names of the implementations that are not being tested
  this.notImplemented = ['bar'];
  // this will give the row label in the matrix
  this.rowLabel = 'Row';
  // this is the column label in the matrix
  this.columnLabel = 'Verifier';
  //this is an array with items in the form {data: 'foo', detail: false, label: 'bar'}
  const reportData = [];
  // reportData is displayed as code examples
  this.reportData = reportData;
  // this is an array with items in the form {src: 'foo', meta: ['bar']}
  // the images will be displayed with the meta under them
  const images = [];
  this.images = images;
  it('should be a cell in the matrix', function() {
    // this tells the reporter which column and row the test result
    // should be placed in
    this.test.cell = {columnId, 'foo', rowId: 'bar'};
  });
  after(function() {
    summaries.add('Test specific summary data here');
  });
})

```

A helpers file can be specified to add project specific helpers to report templates:

```js
// myproject/projectHelpers.js

const helpers = {
  upperCaseTitle(testTitle) {
    return testTitle.toUpperCase();
  }
};
export default helpers;
```

then specify the path to the helpers file in the `--reporter-options helpers="$PWD/projectHelpers.js"`.

Handlebars lets you use the helpers inside of templates like this:

```html
<td class="{{state}} {{getOptional optional}}">{{getStatusMark state}}</td>
```

If you need to know the data the template is receiving try logging the context passed to the report.

The report consists of a number of different configuration options:

```js
export const getConfig = () => {
  const homePath = homeDir();
  const templatesPath = join(homePath, 'templates');
  return {
    title: 'W3C Interop Test',
    dirs: {
      // where to output the resulting HTML report
      // if null we output to console.log
      report: null
    },
    // where to log the resulting mocha root suite
    // this can be used to generate test data
    suiteLog: null,
    // config options for the w3c respect library
    respecConfig: join(homePath, 'respec.json'),
    // where to find the templates for handlebars
    templates: {
      body: join(templatesPath, 'body.hbs'),
      head: join(templatesPath, 'head.hbs'),
      metrics: join(templatesPath, 'metrics.hbs'),
      table: join(templatesPath, 'table.hbs'),
      matrix: join(templatesPath, 'matrix.hbs')
    }
  };
};
```

The templates are written in [Handlebars](https://handlebarsjs.com/).

Most of the configuration options can be specified by command line options:

```sh
mocha tests/ --reporter @digitalbazaar/mocha-w3c-interop-reporter --reporter-options body=\"$PWD/body.hbs\",matrix=\"$PWD/matrix.hbs\",reportDir=\"$PWD/reports\",respec=\"$PWD/respecConfig.json\",title=\"Test Interoperability Report 1.0\",helpers=\"$PWD/templateHelpers.js\",suiteLog='./suite.log' --timeout 15000"
```

- `--reporter` -  Specifies the reporter and is required.

- `--reporter-options` - Passes options to the reporter in the form `key=value[,key2=value[,...]]`.

  - *abstract* - Is a recommended reporter option that provides the abstract for a report.

  - *body* - Is an optional reporter option that provides the body of the report.
         If no body is specified, the default `templates/body.hbs` file is used.

  - *matrix* - Is an optional option that allows customization of matrix test results.
           If no matrix is specified, the default `templates/matrix.hbs` file is used.

  - *reportDir* - Is an optional option that tells the reporter where to write the report HTML.
              If no `dir` is specified, no HTML is written.

  - *respec* - Is a recommended reporter option that provides `respec` config data to `respec`.
           If no json file is specified, the default `./respec.json` is used.

  - *title* - Is a recommended reporter option that sets the `title` of the report.
          Defaults to: 'W3C Interop Test'

  - *helpers* - Is an optional reporter option that provides `handlebars` helpers usable in custom `*.hbs` files.

  - *suiteLog* - Is an optional reporter option that dumps the raw mocha test results to a file.

  - *templateData* - Is an optional reporter option that dumps the data used to make the HTML report as json.

The reporter also has an npx binary for creating test html manually from mocha suites.
This can be used to debug results with out having to rerun an entire test suite.

```sh
npx interopReporter makeReport --suiteLog=./suite.log --output=./reports/manualReport.html
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
