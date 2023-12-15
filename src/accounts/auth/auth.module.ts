import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { fetchConfig } from 'src/app.config';
import { DisableWithoutAuth } from './auth.guard';
import { AuthService } from './auth.service';
import { JWTStrategy } from './jwt.strategy';
import { PlayerModule } from '../player/player.module';
import {GoogleTokenStrategy} from "./google.strategy";

const JWTConfig = JwtModule.registerAsync({
  useFactory: async () => ({
    secret: fetchConfig('app', 'jwt_secret'),
    signOptions: { expiresIn: '2 days' },
  }),
});

const GlobalDisableWithoutAuth = {
  provide: APP_GUARD,
  useClass: DisableWithoutAuth,
};

@Global()
@Module({
  imports: [JWTConfig, PassportModule, PlayerModule],
  exports: [AuthService],
  providers: [AuthService, JWTStrategy, GoogleTokenStrategy, GlobalDisableWithoutAuth],
})
export class AuthModule {}
