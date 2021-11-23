module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'jest-dom'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  ignorePatterns: ['dist/*'],
  rules: {
    'object-shorthand': 'error',
  },
};
