module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript'],
  rules: {
    'consistent-return': 1,
    'no-console': 'off',
    'import/prefer-default-export': 'off',
  },
};
