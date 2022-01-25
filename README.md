# Mocha W3C Interop Reporter

Is a mocha reporter that creates interoperability matrices in existing W3C documents with ReSpec.

## Installation

Using npm

```bash
npm i --save digitalbazaar/mocha-w3c-interop-reporter
```

## Usage

The reporter wraps around existing Mocha interfaces such as `describe` and `it`.
```js
describe('Matrix Test', function() {
  // summaries are displayed in the SOTD section after the result results
  const summaries = new Set();
  this.summary = summaries;
  // when the report sees a suite with report true it includes it
  this.report = true;
  // this tells the reporter to use the matrix.hbs template to display the results
  this.matrix = true;
  // this gives the names of the columns
  this.columns = columnNames;
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

```
<td class="{{state}} {{getOptional optional}}">{{getStatusMark state}}</td>
```

If you need to know the data the template is receiving try logging the context passed to the report.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
