const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: "./src/app",
  output: {
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      }]
  },
  target: 'node',
  externals: [nodeExternals()]
}

