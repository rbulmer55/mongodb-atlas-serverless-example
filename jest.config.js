require('dotenv').config();
// eslint-disable-next-line node/no-unpublished-require
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./.ts-path-config.json');

module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/infra', '<rootDir>/src', '<rootDir>/__mocks__'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
};
