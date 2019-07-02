const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
  loader: 'url-loader?limit=100000' 
};