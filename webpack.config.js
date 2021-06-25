const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, "client/js", "App.jsx"),
    output: { 
      path: path.join(__dirname, "client-build"), 
      filename: "bundle.js",
      clean: true,
    },
    mode: process.env.NODE_ENV || "development",
    resolve: { 
      modules: [path.resolve(__dirname, "client"), "node_modules"] 
    },
    module: {
      rules: [
          { 
              test: /\.(js|jsx)$/, 
              exclude: /node_modules/, 
              use: {
                loader: 'babel-loader'
              }
          }
      ],
  },
    plugins: [
        new CopyWebpackPlugin({
          patterns: [
            { 
              from: "**/*",
              to: path.join(__dirname, "client-build"),
              context: "client",
              globOptions: {
                ignore: [
                  "**/*.jsx",
                ],
              }
            },
          ],    
        }), 
    ],
};