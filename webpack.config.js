const path = require('path');
const fs = require('fs');
const ExtractStringsPlugin = require('./webpack-extract-oftn-l10n.js');

module.exports = {
  entry: './test.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new ExtractStringsPlugin({
    variable: 'R',
    output: path.join(__dirname, 'output.json')
  })]
};