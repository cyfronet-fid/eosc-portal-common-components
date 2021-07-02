const path = require('path');
const execa = require('execa');

/**
 *
 * @param entry
 * @param {"production" | "development"} mode
 */
exports.getTsWebpackConfig = function (mode = "development", entry = null) {
  const config = {
    mode,
    target: "web",
    output: {
      filename: '[name].min.js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      modules: ["node_modules"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          exclude: /node_modules|\.git/,
          use: 'ts-loader'
        }
      ],
    }
  };
  if (entry) {
    config["entry"] = entry;
  }
  return config;
}

exports.getFileNameFrom = function (filePath) {
  return path
    .parse(filePath)
    .base
    .split('.')
    .slice(0, -1)
    .join('.');
}