/**
 * Debugging:
 *   https://eslint.org/docs/latest/use/configure/debug
 *  ----------------------------------------------------
 *
 *   Print a file's calculated configuration
 *
 *     npx eslint --print-config path/to/file.js
 *
 *   Inspecting the config
 *
 *     npx eslint --inspect-config
 *
 */
import globals from 'globals';
import js from '@eslint/js';

import ember from 'eslint-plugin-ember/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';
import qunit from 'eslint-plugin-qunit';
import n from 'eslint-plugin-n';

import babelParser from '@babel/eslint-parser';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
  requireConfigFile: false,
  babelOptions: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ],
  },
};

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ember.configs.base,
  ember.configs.gjs,
  /**
   * Ignores must be in their own object
   * https://eslint.org/docs/latest/use/configure/ignore
   */
  {
    ignores: [
      // unconventional js
      'blueprints/*/files/',
      // compiled output
      'dist/',
      // misc
      'coverage/',
      'DEBUG/',
      '!.*',
      '.*/',
      // ember-try
      '.node_modules.ember-try/',
      // the doc app uses a separate eslint config
      'docs/',
      // build tests
      'build-tests/app-template/',
      // standard ignores
      'node_modules/',
      // problematic files
      'lib/in-repo-pin-addon/**/*',
    ],
  },
  /**
   * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
   */
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
    },
  },
  {
    files: ['**/*.{js,gjs}'],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
        google: false,
      },
    },
    rules: {
      'ember/no-runloop': 'warn', // Change from error to warning for existing code
    },
  },
  {
    ...qunit.configs.recommended,
    files: ['tests/**/*-test.{js,gjs}'],
    plugins: {
      qunit,
    },
    rules: {
      'qunit/require-expect': 'off',
    },
  },
  /**
   * CJS node files
   */
  {
    ...n.configs['flat/recommended-script'],
    files: [
      '**/*.cjs',
      'config/**/*.js',
      'tests/dummy/config/**/*.js',
      'testem.js',
      'testem*.js',
      'index.js',
      '.prettierrc.js',
      '.stylelintrc.js',
      '.template-lintrc.js',
      'ember-cli-build.js',
      'build-tests/build-test.js',
      'lib/**/*.js',
    ],
    plugins: {
      n,
    },
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'n/no-missing-require': 'warn', // Change from error to warning for build-time dependencies
    },
  },
  /**
   * ESM node files
   */
  {
    ...n.configs['flat/recommended-module'],
    files: ['**/*.mjs'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: {
        ...globals.node,
      },
    },
  },
];
