import { Options, defineConfig } from '@mikro-orm/mongodb';
require('dotenv').config();

const config: Options = defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: process.env.DB_URL,
  debug: process.env.NODE_ENV !== 'production',
  dbName: process.env.DB_NAME,
});

export default config;
