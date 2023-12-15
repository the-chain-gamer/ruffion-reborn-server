import {Context, Mutation, Resolver,Query} from '@nestjs/graphql';
import {AuthService} from 'src/accounts/auth/auth.service';
import {Access, Auth, SocialAuth, SocialType} from "../auth/auth.decorator";
import {PlayerService} from 'src/accounts/player/player.service';
import {Session} from "../../../gen/graphql";

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly authService: AuthService, private readonly playerService: PlayerService) {}

  @Auth(Access.Public)
  @SocialAuth(SocialType.Google)
  @Mutation('googleLogin')
  async googleLogin(@Context() ctx:any):Promise<Session>{
    const {email,firstName,lastName}=ctx.req.user.data;
    let player=await this.playerService.get({email});
    if(!player) player=await this.playerService.save({email,firstName,lastName})
    return this.authService.session(player)
  }

  @Auth(Access.Private)
  @Query('currentSession')
  async currentSession(@Context() ctx:any):Promise<Session>{
    const {player,game}=ctx.req.user.data;
    return this.authService.session(player,game);
  }


}
