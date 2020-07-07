const path = require('path');

module.exports = (env = '') => {
  const isDev = env && env == 'dev';
  const fileName = isDev ? 'mstrapi.dev' : 'mstrapi';

  return {
    entry: './lib/mstr.js',
    output: {
      filename: `${fileName}.min.js`,
      path: path.resolve(__dirname, '../dist'),
      library: 'mstrapi',
      libraryTarget: 'var'
    },
    devtool: 'source-map',
    plugins: [
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components|samples|dist)/,
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
    mode: isDev ? 'development' : 'production'
  };
};