import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    './controllers/(.*).js': './controllers/$1.ts',
  },
  setupFiles: ['dotenv/config'], // Loads .env before tests run so env vars are available for API calls (required for golden dataset e2e tests)
};

export default config;
