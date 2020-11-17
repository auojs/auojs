/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  clearMocks: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/**/__TESTS__/**/*spec.[jt]s?(x)']
};
