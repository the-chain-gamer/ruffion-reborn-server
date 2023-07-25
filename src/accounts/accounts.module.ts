import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { SessionResolver } from './session/session.resolver';

@Module({
  imports: [AuthModule, PlayerModule],
  providers: [SessionResolver],
})
export class AccountsModule {}
