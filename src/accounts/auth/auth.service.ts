import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Session } from 'gen/graphql';
import { Player, Game } from 'gen/db';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Build User Session
  session(user: Player, game: Game | null = null): Session {
    return {
      user,
      auth: { token: this.generateToken(user, game) },
      game,
    };
  }

  // Generate JWT Token for a given user
  generateToken(user: Player, game: Game | null ): string {
    const payload = { sub: user.id, gameId: game?.id };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
