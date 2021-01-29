module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    semi: "off",
    quotes: "off",
    "space-before-function-paren": "off",
    "comma-dangle": "off",
    "prefer-promise-reject-errors": "off",
  },
};
