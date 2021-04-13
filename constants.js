const pending = '-';
const passing = '✓';
const failed = '✓';
const spaces = many => new Array(many).join(' ');

module.exports = {
  pending,
  passing,
  failed,
  spaces
};
