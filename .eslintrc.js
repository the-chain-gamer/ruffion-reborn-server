module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: [
    'filenames',
    '@typescript-eslint/eslint-plugin'
  ],
  extends: [],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'src/graphql/index.ts',
    'src/graphql/schema.gql',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'airbnb-base',
        'airbnb-typescript/base',
      ],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        'import/prefer-default-export': 'off',
        'import/no-cycle': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              'test/**/*.ts',
              'src/**/*.spec.ts',
              'src/database/{config,factories,seeds}/*.ts'
            ],
          }
        ],
        'class-methods-use-this': 'off',
        'filenames/match-regex': ['error', '^[a-z0-9\\_\\-\\.]+$', true],
        'implicit-arrow-linebreak': 'off',
        'no-underscore-dangle': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
      },
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      extends: [
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        schema: './src/graphql/schema.gql',
      },
    }
  ]
};
