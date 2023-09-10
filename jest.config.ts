import { Config } from "jest";

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['__tests__/utils/'],
  coveragePathIgnorePatterns: ['/node_modules/', '__tests__/utils/', 'src/server/migrations/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: '__tests__/tsconfig.json' }
    ],
  }
}

export default config;