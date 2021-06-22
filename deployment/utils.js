const {src, dest} = require('gulp');
const path = require('path');
const del = require('del');
const rename = require('gulp-rename');

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

/**
 *
 * @param entry
 * @param {"production" | "development"} mode
 */
exports.getScssWebpackConfig = function (mode = "development", entry = null) {
  const config = {
    mode,
    target: 'web',
    output: {
      filename: ''
    },
    resolve: {
      extensions: ['.scss'],
      modules: ["node_modules"]
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {name: '[name].min.css'}
            },
            {loader: 'sass-loader'}
          ],
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

/**
 *
 * @param cb
 * @param mode
 * @return {*}
 */
exports.replaceEnvConfig = (cb, mode) => {
  if (mode === "development") {
    cb();
    return;
  }

  return src(`env/env.js`)
    .pipe(rename('env.temp.js'))
    .pipe(dest('env/.'))
    .pipe(src(`env/env.${mode}.js`))
    .pipe(rename(`env.js`))
    .pipe(dest('env/.'));
}

/**
 *
 * @param cb
 * @param mode
 * @return {*}
 */
exports.restoreEnvFiles = (cb, mode) => {
  if (mode === "development") {
    cb();
    return;
  }

  return src(`env/env.temp.js`)
    .pipe(rename(`env.js`))
    .pipe(dest('env/.'))
    .on('end', (cb) => del('env/env.temp.js', cb));
}

