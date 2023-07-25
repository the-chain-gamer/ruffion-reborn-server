import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Player } from 'gen/graphql';
import { AssetsService } from '../../assets/assets.service';

@Resolver('Player')
export class PlayerResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @ResolveField('assets')
  assets(@Parent() player: Player) {
    return this.assetsService.getAssets({ player: { id: player.id } });
  }
}
