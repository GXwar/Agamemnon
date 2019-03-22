const path = require('path');
const nodeExternals = require('webpack-node-externals');

const curRoot = __dirname;

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: '[name].js',
    path: path.resolve(curRoot, 'dist')
  },
  target: 'node',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [
          path.resolve(curRoot, 'node_modules')
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [
    nodeExternals()
  ]
};
