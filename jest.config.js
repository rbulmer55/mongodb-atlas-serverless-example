module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/infra', '<rootDir>/src'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
};
