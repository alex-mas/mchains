const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
      "mchains":'./src/mchains.js',
      "mchais.min": './src/mchains.js'
    },
    output: {
      path: __dirname+'/bin',
      filename: '[name].js',
      // export to AMD, CommonJS, or window
      libraryTarget: 'umd',
      // the name exported to window
      library: 'mchains'
    },
    plugins: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        sourceMap:true
      })
    ]
  };

