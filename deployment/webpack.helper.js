const TerserPlugin = require("terser-webpack-plugin");

exports.webpackConfig = (production) => ({
  mode: production ? "production" : "development",
  resolve: {
    extensions: [".jsx", ".js", ".json"],
    modules: ["node_modules"],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules|\.git/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: production,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: "5",
          topLevel: true,
          compress: true,
        },
      }),
    ],
  },
});
