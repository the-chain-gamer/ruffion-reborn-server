import { Global, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';

@Global()
@Module({
  providers: [GameService, GameResolver],
  exports: [GameService],
})
export class GameModule {}
