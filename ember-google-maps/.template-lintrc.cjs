'use strict';

const baseConfig = require('@ijlee2-frontend-configs/ember-template-lint');

module.exports = {
	...baseConfig,
	overrides: [
		...(baseConfig.overrides ?? []),
		{
			files: ['src/components/g-map.gjs'],
			rules: {
				'no-yield-only': false,
			},
		},
	],
};
