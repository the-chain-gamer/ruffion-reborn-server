import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JWTGuard } from './auth.guard';

export const META_MODE = 'AUTH_MODE';

// Define Non-UserType Access Modes
export enum Access {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

// Auth Mode must be either an AccessMode or a list of User types
export type AuthMode = Access;

// Custom Auth Decorator
export function Auth(mode: AuthMode) {
  const guards = mode === Access.Public ? [] : [JWTGuard];

  return applyDecorators(SetMetadata(META_MODE, mode), UseGuards(...guards));
}
