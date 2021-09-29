module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended", "plugin:react/recommended", "airbnb"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "prettier/prettier": "error",
    "linebreak-style": ["error", "unix"],
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "object-curly-spacing": ["error", "always"],
    quotes: ["error", "double"],
    "no-underscore-dangle": "off",
    "no-use-before-define": "off",
    "max-len": ["error", { code: 120, tabWidth: 2 }],
    "comma-dangle": "off",
    "react/jsx-props-no-spreading": "off"
  },
};
