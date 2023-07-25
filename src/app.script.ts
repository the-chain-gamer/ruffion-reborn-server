import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { AppDataSource } from './database/app.datasource';

/**
 * Helper to run various scripts with the
 * NestJS app and TypeORM database contexts
 */

interface ScriptContext {
  app: INestApplicationContext;
  datasource: DataSource;
}

type Runnable = (context: ScriptContext) => void;

export const RunInContext = async (runnable: Runnable) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const datasource = await AppDataSource.initialize();

  // Execute the script in the app context
  await runnable({ app, datasource });

  await app.close();
  process.exit(0);
};
