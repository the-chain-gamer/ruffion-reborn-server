import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as EntityExports from './entities';

const ENTITIES = Object.values(EntityExports);

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  exports: [TypeOrmModule],
})
export class EntityModule {}
