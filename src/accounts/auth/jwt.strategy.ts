import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { fetchConfig } from 'src/app.config';
import { AuthService } from './auth.service';
import { PlayerService } from '../player/player.service';
import { GameService } from '../../game/game.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private playerService: PlayerService,
    private gameService: GameService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: fetchConfig('app', 'jwt_secret'),
    });
  }

  // Fetch and store user in request context
  async validate(payload: any) {
    const { sub, gameId } = payload;
    const player = await this.playerService.get({ id: sub }); // fetch player profile
    const game = await this.gameService.get({ id: gameId }); // fetch game
    if (!(player && game)) throw new UnauthorizedException();
    return { data: { game, player } };
  }
}
