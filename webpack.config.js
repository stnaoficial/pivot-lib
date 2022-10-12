const HtmlWebpackPlugin = require('html-webpack-plugin');

const glob = require('glob')
const path = require('path');

module.exports = {
  entry: glob.sync('./src/**/*.ts'),
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'pivot.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'test/index.html'),
    }) 
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 8000,
  },
};