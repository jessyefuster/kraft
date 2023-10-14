module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'spaced-comment': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-duplicate-imports': 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'newline-before-return': 'error',
    'camelcase': 'warn',
    'object-curly-spacing': ['error', 'always'],
    'require-await': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'eqeqeq': 'error',
    'quotes': ['warn', 'single', { avoidEscape: true }],
  
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/semi': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
          delimiter: 'semi',
          requireLast: true
      },
      singleline: {
          delimiter: 'semi',
          requireLast: false
      }
    }],
  
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/disable-enable-pair': 'off',
  
    'import/default': 'off',
    'import/no-duplicates': ['error'],
    'import/no-named-as-default-member': 'off',
    'import/order': ['error', {
      groups: [
        ['builtin', 'external'],
        ['internal', 'index', 'sibling', 'parent', 'object']
      ],
      'newlines-between': 'always-and-inside-groups'
    }],
  },
}