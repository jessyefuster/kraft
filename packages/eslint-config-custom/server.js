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
  ignorePatterns: ['build', '.eslintrc.js', 'src/migrations', 'jest.config.ts'],
  rules: {
    ...base.rules,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: 'req|res|next|err' }],
  }
}