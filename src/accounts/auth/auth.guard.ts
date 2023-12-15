/* eslint-disable max-classes-per-file */

import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Access, META_MODE} from './auth.decorator';


// Support reflection on both function and class levels
export const getMode = <T>(reflector: Reflector, context: ExecutionContext, mode:META_MODE):T => {
  const reflectionContext = [context.getHandler(), context.getClass()];

  return reflector.getAllAndOverride<T>(mode, reflectionContext);
};

// Ensure a valid google token has been passed
@Injectable()
export class GoogleTokenGuard extends AuthGuard('google-token') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    ctx.req.body={...ctx.req.body,...ctx.req.body.variables}
    return ctx.req;
  }
}

// Ensure a valid JWT token has been passed
@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }
}


// Ensure the user can perform gameplay operations
@Injectable()
export class GameGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const {user:{data:{game}}} = GqlExecutionContext.create(context).getContext();
    const gameMode=getMode<boolean>(this.reflector, context,META_MODE.Game);
    if(gameMode) return !!game;
    return true;
  }
}

// Disable all requests when an AuthMode is not explicitly set
@Injectable()
export class DisableWithoutAuth implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    return !!getMode<Access>(this.reflector, context,META_MODE.Auth);
  }
}
