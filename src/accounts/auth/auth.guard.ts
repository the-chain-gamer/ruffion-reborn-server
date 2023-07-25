/* eslint-disable max-classes-per-file */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthMode, META_MODE } from './auth.decorator';

// Support reflection on both function and class levels
const getMode = (reflector: Reflector, context: ExecutionContext) => {
  const reflectionContext = [context.getHandler(), context.getClass()];

  return reflector.getAllAndOverride<AuthMode>(META_MODE, reflectionContext);
};

// Ensure a valid JWT token has been passed
@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }
}

// Disable all requests when an AuthMode is not explicitly set
@Injectable()
export class DisableWithoutAuth implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    return !!getMode(this.reflector, context);
  }
}
