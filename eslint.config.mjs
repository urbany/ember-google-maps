import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import ember from "eslint-plugin-ember";
import n from "eslint-plugin-n";
import qunit from "eslint-plugin-qunit";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      "dist/",
      "tmp/",
      "node_modules/",
      "bower_components/",
      ".git/",
      ".DS_Store",
      ".vscode/",
      ".idea/",
      "*.log",
      "coverage/",
      "!.*",
    ],
  },
  // Base config for JS files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        google: false,
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
          ],
        },
      },
    },
    plugins: {
      ember,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ember.configs.recommended.rules,
      ...prettierConfig.rules,
    },
  },
  // Node files override
  {
    files: [
      "./.eslintrc.js",
      "./.prettierrc.js",
      "./.stylelintrc.js",
      "./.template-lintrc.js",
      "./ember-cli-build.js",
      "./index.js",
      "./testem.js",
      "./blueprints/*/index.js",
      "./config/**/*.js",
      "./tests/dummy/config/**/*.js",
      "./build-tests/build-test.js",
      "./build-tests/**/config/**/*.js",
      "./lib/**/*.js",
      "./docs/config/**/*.js",
      "./docs/ember-cli-build.js",
      "./docs/testem.js",
      "./docs/.eslintrc.js",
      "./docs/.prettierrc.js",
      "./docs/.stylelintrc.js",
      "./docs/.template-lintrc.js",
      "./build-tests/app-template/config/**/*.js",
      "./build-tests/app-template/ember-cli-build.js",
      "./build-tests/app-template/testem.js",
      "./build-tests/app-template/.eslintrc.js",
      "./build-tests/app-template/.prettierrc.js",
      "./build-tests/app-template/.stylelintrc.js",
      "./build-tests/app-template/.template-lintrc.js",
    ],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n,
    },
    rules: {
      ...n.configs.recommended.rules,
    },
  },
  // Test files override
  {
    files: ["tests/**/*-test.{js,ts}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
          ],
        },
      },
    },
    plugins: {
      qunit,
    },
    rules: {
      ...qunit.configs.recommended.rules,
      "qunit/require-expect": "off",
    },
  },
];
