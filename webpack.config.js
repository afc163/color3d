const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'demo': "./example/demo.js"
  },
  devtool: 'inline-source-map',
  devServer: {
    host: "127.0.0.1",
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'site'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/index.html',
    }),
  ],
};
