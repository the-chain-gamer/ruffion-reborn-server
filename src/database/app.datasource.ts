import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { fetchConfig } from 'src/app.config';

const PATH_ROOT = join(process.cwd(), 'src/database/');
const buildConfigPath = (middle) => [join(PATH_ROOT, `${middle}.{ts,js}`)];

// NestJS Module options for TypeORM
export const MODULE_OPTIONS: TypeOrmModuleOptions = {
  ...fetchConfig('database'),
  type: 'postgres',
  autoLoadEntities: true,
  synchronize: true,

  namingStrategy: new SnakeNamingStrategy(),
};

// Config for Typeorm CLI migrations as they are different from nest/typeorm configs
export const CLI_OPTIONS: any = {
  ...MODULE_OPTIONS,
  migrationsTableName: '__schema_migrations',
  migrations: buildConfigPath('migrations/*'),
  factories: buildConfigPath('factories/*.factory'),
  entities: buildConfigPath('entities/*.entity'),
};

// Create a TypeORM DataSource instance for use in scripts
export const AppDataSource = new DataSource(CLI_OPTIONS);

export default CLI_OPTIONS;
