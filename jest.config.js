/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo/android',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/tests/components/**/*.test.tsx', '<rootDir>/tests/components/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^react-native/setup-env$': '<rootDir>/node_modules/react-native/Libraries/Core/InitializeCore.js',
    '^react-native/asset-registry$': '<rootDir>/node_modules/react-native/Libraries/Image/AssetRegistry.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|lucide-react-native|@shopify/flash-list|firebase|@firebase/.*)',
  ],
  testEnvironment: 'node',
};
