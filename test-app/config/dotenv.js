'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (env) {
  let isCI = Boolean(process.env.CI);
  let rootDir = path.join(path.dirname(__dirname), '..');
  let envPath = path.join(rootDir, `.env.${env}`);
  let fallbackPath = path.join(rootDir, '.env');

  return {
    enabled: !isCI, // disable for CI
    clientAllowedKeys: ['GOOGLE_MAPS_API_KEY'],
    failOnMissingKey: false,
    path: fs.existsSync(envPath) ? envPath : fallbackPath,
  };
};
