import { Inject, Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { AssetsInput, EventName, GameStatus, Session } from 'gen/graphql';
import { Assets, Game, Player } from 'gen/db';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSubEngine } from 'graphql-subscriptions';
import { AuthService } from '../accounts/auth/auth.service';

@Injectable()
export class GameService {
  constructor(
    private connection: DataSource,
    private authService: AuthService,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  async createGame(
    playerInput: DeepPartial<Player>,
    gameName: string,
    assets: AssetsInput,
  ): Promise<Session | null> {
    const { cards, dogs } = assets;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const player = await queryRunner.manager.save(Player, { ...playerInput, turnNo: 0 });
      const game = await queryRunner.manager.save(Game, {
        name: gameName,
        player1: player,
      });
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Assets)
        .values({ dogs, cards, player })
        .orUpdate({ conflict_target: ['player_id'], overwrite: ['cards', 'dogs'] })
        .execute();
      // TODO: Fetch user deck from blockchain here;
      // TODO: Update user decks cards with cards already seeded;
      await queryRunner.commitTransaction();
      return this.authService.session(player, game);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new Error(e);
    } finally {
      await queryRunner.release();
    }
  }

  async joinGame(
    playerInput: DeepPartial<Player>,
    gameId: string,
    assets: AssetsInput,
  ): Promise<Session | null> {
    const { cards, dogs } = assets;

    const queryRunner = await this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const player = await queryRunner.manager.save(Player, { ...playerInput, turnNo: 0 });
      const gameJoined = await queryRunner.manager
        .createQueryBuilder()
        .update(Game, { player2: playerInput, status: GameStatus.STARTED })
        .where({ id: gameId, status: GameStatus.WAITING, player2: IsNull() })
        .execute();

      if (gameJoined.affected !== 1) {
        throw new Error('Room not available');
      }

      const game = await queryRunner.manager.findOne(Game, {
        relations: { player1: true, player2: true, turn: true, winner: true },
        where: { id: gameId as any },
      });
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Assets)
        .values({ dogs, cards, player })
        .orUpdate({ conflict_target: ['player_id'], overwrite: ['dogs', 'cards'] })
        .execute();

      // TODO: Fetch user deck from blockchain here;
      // TODO: Update user decks cards with cards already seeded;
      await queryRunner.commitTransaction();
      return this.authService.session(player, game);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new Error(e);
    } finally {
      await queryRunner.release();
    }
  }

  async handleDisconnect(playerId: string, gameId: string) {
    const { status, player1, player2 } = await this.get({ id: gameId });
    switch (status) {
      case GameStatus.WAITING:
        await this.save({ id: gameId, status: GameStatus.OVER });
        break;
      case GameStatus.STARTED:
        const opponent = this.resolveOpponent({ id: playerId } as any, player1, player2);
        await this.save({ id: gameId, winner: opponent, status: GameStatus.OVER });
        const game = await this.get({ id: gameId });
        await this.pubSub.publish(`gameUpdates-${game.id}`, {
          gameUpdates: { ...game, eventName: EventName.FORFEIT },
        });
        break;
      default:
    }
  }

  checkStatus(status: GameStatus) {
    switch (status) {
      case GameStatus.OVER:
        throw new Error('Room is not available');
      case GameStatus.WAITING:
        throw new Error('Game is not started yet');
      default:
    }
  }

  checkTurn(currentPlayer: Player, turn: Player | null, expiresAt: Date | null) {
    const currentTime = new Date();
    if (!(currentPlayer.id === turn?.id && currentTime <= expiresAt)) {
      throw new Error('Wait for your turn');
    }
  }

  checkHandOverTurn(currentPlayer: Player, turn: Player | null) {
    if (currentPlayer.id !== turn?.id) {
      throw new Error('You dont have the turn to handover');
    }
  }

  checkClaimTurn(currentPlayer: Player, turn: Player | null, expiresAt: Date | null) {
    const currentTime = new Date();
    if (currentPlayer.id === turn?.id || currentTime <= expiresAt) {
      throw new Error('Cannot claim the ongoing turn');
    }
  }

  resolveOpponent(currentPlayer: Player, player1: Player, player2: Player): Player {
    if (currentPlayer.id === player1.id) {
      return player2;
    }
    return player1;
  }

  buildExpiry(): Date {
    const expiry = new Date();
    const interval = expiry.getSeconds() + 50;
    expiry.setSeconds(interval);
    return expiry;
  }

  async get(whereInput: FindOptionsWhere<Game>): Promise<Game | null> {
    return this.gameRepo.findOne({
      where: whereInput,
      relations: { player1: true, player2: true, turn: true, winner: true },
    });
  }

  async all(whereInput?: FindOptionsWhere<Game>): Promise<Game[] | null> {
    return this.gameRepo.find({
      where: whereInput,
      select: { status: true, id: true, name: true },
    });
  }

  async save(createInput: DeepPartial<Game>): Promise<Game | null> {
    return this.gameRepo.save(createInput);
  }
}
