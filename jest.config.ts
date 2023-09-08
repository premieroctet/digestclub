import type { Config } from '@jest/types';
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', 'src/'],
  testEnvironment: 'jest-environment-jsdom',
};
module.exports = createJestConfig(customJestConfig);
