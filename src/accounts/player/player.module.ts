import { Global, Module } from '@nestjs/common';
import { PlayerResolver } from './player.resolver';
import { PlayerService } from './player.service';

@Global()
@Module({
  providers: [PlayerService, PlayerResolver],
  exports: [PlayerService],
})
export class PlayerModule {}
