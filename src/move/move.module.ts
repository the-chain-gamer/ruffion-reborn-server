import { Global, Module } from '@nestjs/common';
import { MoveService } from './move.service';

@Global()
@Module({
  providers: [MoveService],
  exports: [MoveService],
})
export class MoveModule {}
