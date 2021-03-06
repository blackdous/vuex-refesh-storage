module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    "^@/(.*)$": '<rootDir>/src/$1',
    "^test/(.*)$": '<rootDir>/test/$1'
  },
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
}