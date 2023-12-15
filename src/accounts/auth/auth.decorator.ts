import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import {GameGuard, GoogleTokenGuard, JWTGuard} from './auth.guard';

export enum META_MODE  {
    Auth = 'AUTH_MODE',
    Game = 'Game_MODE'
}


// Define Non-UserType Access Modes
export enum Access {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}


//Define supported social login types
export enum SocialType {
  Google = 'GOOGLE'
}

export function SocialAuth(type:SocialType) {
      switch (type) {
        default:
          return applyDecorators(UseGuards(GoogleTokenGuard))
      }
}


// Custom Game Auth Decorator
export function Auth(authMode: Access,gameMode:boolean=false) {
  const guards = authMode === Access.Public ? [] : [JWTGuard,GameGuard];

  return applyDecorators(SetMetadata(META_MODE.Auth, authMode),SetMetadata(META_MODE.Game,gameMode), UseGuards(...guards));
}
