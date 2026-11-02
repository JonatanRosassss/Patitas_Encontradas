
module.exports = {
  preset: 'jest-expo',
  testMatch: [
    '**/tests/**/*.jest.test.ts',
    '**/tests/**/*.jest.test.tsx',
  ],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
