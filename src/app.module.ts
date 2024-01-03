import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from 'src/accounts/accounts.module';
import { DatabaseModule } from 'src/database/database.module';
import { SystemController } from 'src/system/system.controller';
import { Web3Module } from 'src/web3/web3.module';
import { GameModule } from 'src/game/game.module';
import { loadConfig } from './app.config';
import { GQLModule, GQLSubscriptionProvider } from './graphql.utils';
import { AssetsModule } from './assets/assets.module';
import { MoveModule } from './move/move.module';

// Generate Config Module
const AppConfig = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});

@Global()
// Export Root App
@Module({
  imports: [
    AppConfig,
    GQLModule,
    DatabaseModule,
    AccountsModule,
    Web3Module,
    GameModule,
    AssetsModule,
    MoveModule,
  ],
  providers: [GQLSubscriptionProvider],
  exports: [(GQLSubscriptionProvider as any).provide],
  controllers: [SystemController],
})
export class AppModule {}
