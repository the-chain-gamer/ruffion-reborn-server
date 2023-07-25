import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { AppliedCardInput, AssetsInput, EventName, GameStatus, MoveDogInput, PlayerInput } from 'gen/graphql';
import { Game } from 'gen/db';
import { GameService } from './game.service';
import { Access, Auth } from '../accounts/auth/auth.decorator';
import { AssetsService } from '../assets/assets.service';
import { MoveService } from '../move/move.service';
import { PlayerService } from '../accounts/player/player.service';

@Resolver('Game')
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly assetsService: AssetsService,
    private readonly moveService: MoveService,
    private readonly playerService: PlayerService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  @Auth(Access.Public)
  @Mutation('createGame')
  createGame(@Args('player') player: PlayerInput,
             @Args('gameName') gameName: string,
             @Args('assets') assets: AssetsInput,
  ) {
    return this.gameService.createGame(player, gameName, assets);
  }


  @Auth(Access.Public)
  @Mutation('joinGame')
  async joinGame(
    @Args('player') player: PlayerInput,
    @Args('gameId') gameId: string,
    @Args('assets') assets: AssetsInput,
  ) {
    const session = await this.gameService.joinGame(player, gameId, assets);
    await this.pubSub.publish(`gameUpdates-${session.game.id}`, { gameUpdates: { ...session.game, eventName: EventName.JOINED } });
    return session;
  }

  @Auth(Access.Public)
  @Query('games')
  games() {
    return this.gameService.all({ status: GameStatus.WAITING });
  }

  @Auth(Access.Private)
  @Mutation('makeMove')
  async makeMove(@Args('moves') moves: Array<MoveDogInput>, @Context() ctx: any) {
    const { game, player } = ctx.req.user.data;
    const { status, turn, turnExpiresAt } = game as Game;
    this.gameService.checkStatus(status);
    this.gameService.checkTurn(player, turn, turnExpiresAt);

    const { id, dogs: assetsDogs } = await this.assetsService.getAssets({ player: { id: player.id } });

    // TODO need to check valid move and cards

    const updatedDogs = assetsDogs.map((playerDog) => {
      const dogToUpdate = moves.find((moveDog)=> moveDog.id === playerDog.id);
      if (dogToUpdate) return { ...playerDog, ...dogToUpdate };
      return playerDog;
    });

    const updatedAssets = await this.assetsService.save({ id, dogs: updatedDogs });
    await this.pubSub.publish(`gameUpdates-${game.id}`, { gameUpdates: { ...game, eventName: EventName.MOVE } });
    return !!updatedAssets;
  }

  @Auth(Access.Private)
  @Mutation('claimTurn')
  async claimTurn(@Context() ctx: any) {
    const { game, player } = ctx.req.user.data;
    const { turn, turnExpiresAt, status } = game as Game;
    this.gameService.checkStatus(status);
    this.gameService.checkClaimTurn(player, turn, turnExpiresAt);
    await this.playerService.save({ ...player, turnNo: player.turnNo + 1 });
    await this.gameService.save({ ...game, turn: player, turnExpiresAt: this.gameService.buildExpiry() });
    const updatedGame = await this.gameService.get({ id: game.id });
    await this.pubSub.publish(`gameUpdates-${updatedGame.id}`, { gameUpdates: { ...updatedGame, eventName: EventName.TURNCHANGE } });
    return !!updatedGame;
  }

  @Auth(Access.Private)
  @Mutation('handOverTurn')
  async handOverTurn(@Context() ctx: any) {
    const { game, player } = ctx.req.user.data;
    const { player1, player2, turn, status } = game as Game;
    this.gameService.checkStatus(status);
    this.gameService.checkHandOverTurn(player, turn);
    const opponent = this.gameService.resolveOpponent(player, player1, player2);
    await this.playerService.save({ ...opponent, turnNo: opponent.turnNo + 1 });
    await this.gameService.save({ ...game, turn: opponent, turnExpiresAt: this.gameService.buildExpiry() });
    const updatedGame = await this.gameService.get({ id: game.id });
    await this.pubSub.publish(`gameUpdates-${updatedGame.id}`, { gameUpdates: { ...updatedGame, eventName: EventName.TURNCHANGE } });
    return !!updatedGame;
  }

  @Auth(Access.Private)
  @Mutation('makeAttack')
  async makeAttack(
    @Context() ctx: any,
    @Args('moves') moves: Array<MoveDogInput> | null,
    @Args('opponentMoves') opponentMoves: Array<MoveDogInput> | null,
    @Args('appliedAttackCard') appliedAttackCard: AppliedCardInput | null,
  ) {
    let { game, player } = ctx.req.user.data;
    const { status, turn, turnExpiresAt, player1, player2 } = game as Game;
    this.gameService.checkStatus(status);
    this.gameService.checkTurn(player, turn, turnExpiresAt);
    const opponent = this.gameService.resolveOpponent(player, player1, player2);

    const opponentAssets = await this.assetsService.getAssets({ player: { id: opponent.id } });
    const playerAssets = await this.assetsService.getAssets({ player: { id: player.id } });
    // TODO need to check valid move and cards
    const updatedOpponentDogs = opponentAssets.dogs.map((playerDog) => {
      const dogToUpdate = opponentMoves?.find((moveDog)=> moveDog.id === playerDog.id);
      if (dogToUpdate) return { ...playerDog, ...dogToUpdate };
      return playerDog;
    });

    const updatedPlayerDogs = playerAssets.dogs.map((playerDog) => {
      const dogToUpdate = moves?.find((moveDog)=> moveDog.id === playerDog.id);
      if (dogToUpdate) return { ...playerDog, ...dogToUpdate };
      return playerDog;
    });

    const updatedOpponentAssets = await this.assetsService.save({ id: opponentAssets.id, dogs: updatedOpponentDogs });

    const updatedPlayerAssets = await this.assetsService.save({ id: playerAssets.id, dogs: updatedPlayerDogs });

    const isAnyDogAlive = updatedOpponentDogs.some((dog) => dog.health > 0);

    if (!isAnyDogAlive) {
      await this.gameService.save({ id: game.id, winner: player, status: GameStatus.OVER });
      game = await this.gameService.get({ id: game.id });
    }

    await this.pubSub.publish(`gameUpdates-${game.id}`, { gameUpdates: { ...game, appliedAttackCard, eventName: EventName.ATTACK } });
    return !!(updatedPlayerAssets || updatedOpponentAssets);
  }


  @Auth(Access.Public)
  @Subscription('gameUpdates')
  async gameUpdates(@Context() ctx: any) {
    const { gameId } = ctx.extra.user;
    return this.pubSub.asyncIterator(`gameUpdates-${gameId}`);
  }

}

