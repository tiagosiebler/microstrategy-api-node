const path = require('path');

module.exports = {
  entry: './lib/mstr.js',
  output: {
    filename: 'mstrapi.min.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'mstrapi',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components|samples)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
              'targets': {
                'node': 'current'
              }
            }]]
          }
        }
      }
    ]
  },
  mode: 'production'
};