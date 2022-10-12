const glob = require('glob')
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'test/index.html'),
  }),
];

module.exports = {
  plugins: plugins,
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
    extensions: ['.ts', '.js', '.css'],
  },
  output: {
    filename: 'pivot.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname, "test"),
    compress: true,
    port: 8000,
  },
};