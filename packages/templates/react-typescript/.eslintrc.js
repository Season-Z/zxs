module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
      typescript: {},
    },
  },
  rules: {
    'import/extensions': [
      2,
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/prefer-default-export': 0,
    'import/no-unresolved': 2,
    '@typescript-eslint/no-useless-constructor': 2,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,

    'react/jsx-filename-extension': [2, { extensions: ['.tsx', 'ts', '.jsx', 'js'] }],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-indent': [2, 2],
    'react/jsx-one-expression-per-line': 0,
    'react/destructuring-assignment': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,

    'lines-between-class-members': [2, 'always'],
    'linebreak-style': [2, 'unix'],
    quotes: [2, 'single'],
    semi: [2, 'never'],
    'no-unused-expressions': 1,
    'no-plusplus': 0,
    'no-console': 0,
    'class-methods-use-this': 2,
    'global-require': 0,
  },
}
