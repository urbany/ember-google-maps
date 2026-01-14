import globals from "globals";
import js from "@eslint/js";
import ember from "eslint-plugin-ember/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import qunit from "eslint-plugin-qunit";
import n from "eslint-plugin-n";
import babelParser from "@babel/eslint-parser";

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: "latest",
  requireConfigFile: false,
  babelOptions: {
    plugins: [
      ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
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
   */
  {
    ignores: [
      // unconventional js
      "blueprints/*/files/",
      // compiled output
      "dist/",
      // misc
      "coverage/",
      "!.*",
      ".*/",
      // ember-try
      ".node_modules.ember-try/",
      // code snippets
      "code-snippets/",
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      parser: babelParser,
    },
  },
  {
    files: ["**/*.{js,gjs}"],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
        google: false,
      },
    },
  },
  {
    ...qunit.configs.recommended,
    files: ["tests/**/*-test.{js,gjs}"],
    plugins: {
      qunit,
    },
  },
  /**
   * CJS node files
   */
  {
    ...n.configs["flat/recommended-script"],
    files: [
      "**/*.cjs",
      "config/**/*.js",
      "testem.js",
      "testem*.js",
      ".prettierrc.js",
      ".stylelintrc.js",
      ".template-lintrc.js",
      "ember-cli-build.js",
      "blueprints/*/index.js",
      "lib/*/index.js",
      "server/**/*.js",
    ],
    plugins: {
      n,
    },
    languageOptions: {
      sourceType: "script",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
      },
    },
  },
];
