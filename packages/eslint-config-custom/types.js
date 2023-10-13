const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

const base = require('./base');

module.exports = {
  ...base,
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  env: { node: true, es2020: true },
  ignorePatterns: ['.eslintrc.js'],
  rules: base.rules,
}