import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from 'src/accounts/accounts.module';
import { DatabaseModule } from 'src/database/database.module';
import { SystemController } from 'src/system/system.controller';
import { Web3Module } from 'src/web3/web3.module';
import { GameModule } from 'src/game/game.module';
import { loadConfig } from './app.config';
import { GQLModule, GQLSubscriptionProvider } from './graphql.utils';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
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
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
      exclude:['/graphql','/app/health']

    }),
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
