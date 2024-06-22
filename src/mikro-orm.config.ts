import { Options, defineConfig } from '@mikro-orm/mongodb';
import { SeedManager } from '@mikro-orm/seeder';
require('dotenv').config();

const config: Options = defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: process.env.DB_URL,
  debug: process.env.NODE_ENV !== 'production',
  dbName: process.env.DB_NAME,
  // @ts-ignore
  extensions: [SeedManager],
  seeder: {
    path: './dist/src/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).seeder.{ts,js}',
    emit: 'ts',
    fileName: (className: string) => `${className}.seeder`,
  },
});

export default config;
