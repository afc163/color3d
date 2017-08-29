const path = require('path');

module.exports = {
  entry: {
    'demo': "./example/demo.js"
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './example',
    host: "127.0.0.1"
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'color3d'
  }  
};
