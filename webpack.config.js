const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'demo': "./example/demo.js",
    'tool': "./example/tool.js"
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
      inject: true,
      chunks: ['demo'],
      filename: 'index.html',
      template: 'example/index.html',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['tool'],
      filename: 'tool.html',
      template: 'example/tool.html',
    }),
  ],
};
