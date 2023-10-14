const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

const base = require('./base');

module.exports = {
  ...base,
  parserOptions: {
    project,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
    react: {
      version: 'detect',
    }
  },
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.js', 'vite.config.ts', 'vite-env.d.ts'],
  plugins: [...base.plugins, 'react', 'react-refresh', '@arthurgeron/react-usememo'],
  extends: [
    ...base.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    ...base.rules,

    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-array-index-key': 'warn',
    'react/jsx-no-useless-fragment': 'error',
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'react/jsx-no-constructed-context-values': 'error',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    '@arthurgeron/react-usememo/require-usememo': ['warn', { checkHookReturnObject: true }],
  }
}