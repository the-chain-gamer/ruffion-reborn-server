import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule } from './entity.module';
import { MODULE_OPTIONS } from './app.datasource';

@Module({
  imports: [TypeOrmModule.forRoot(MODULE_OPTIONS), EntityModule],
})
export class DatabaseModule {}
