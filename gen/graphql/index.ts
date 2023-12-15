
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum GameStatus {
    WAITING = "WAITING",
    STARTED = "STARTED",
    OVER = "OVER"
}

export enum EventName {
    FORFEIT = "FORFEIT",
    JOINED = "JOINED",
    TURNCHANGE = "TURNCHANGE",
    MOVE = "MOVE",
    ATTACK = "ATTACK"
}

export class PlayerInput {
    id: string;
    name: string;
}

export class CardInput {
    id: string;
    name: string;
}

export class DogInput {
    id: string;
    name: string;
    health: number;
    tileNo: number;
}

export class MoveDogInput {
    id: string;
    tileNo: number;
    health: number;
}

export class AppliedCardInput {
    dogId: string;
    cardId: string;
    targetDogs: TargetDogsInput[];
}

export class TargetDogsInput {
    playerId: string;
    dogId: string;
}

export class AssetsInput {
    dogs: DogInput[];
    cards: CardInput[];
}

export class MoveInput {
    dog: string;
    unit: number;
}

export class Player {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    turnNo: number;
    assets?: Nullable<Assets>;
}

export class Session {
    user: Player;
    auth: SessionAuth;
    game?: Nullable<Game>;
}

export class SessionAuth {
    token: string;
}

export abstract class IMutation {
    abstract googleLogin(access_token: string): Nullable<Session> | Promise<Nullable<Session>>;

    abstract createGame(assets: AssetsInput, gameName: string): Nullable<Session> | Promise<Nullable<Session>>;

    abstract joinGame(assets: AssetsInput, gameId: string): Nullable<Session> | Promise<Nullable<Session>>;

    abstract makeMove(moves: MoveDogInput[]): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract makeAttack(appliedAttackCard: AppliedCardInput, opponentMoves?: Nullable<MoveDogInput[]>, moves?: Nullable<MoveDogInput[]>): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract claimTurn(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract handOverTurn(): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export abstract class IQuery {
    abstract currentSession(): Nullable<Session> | Promise<Nullable<Session>>;

    abstract games(): Game[] | Promise<Game[]>;
}

export class Card {
    id: string;
    name: string;
}

export class Dog {
    id: string;
    name: string;
    health: number;
    tileNo: number;
}

export class Assets {
    id: string;
    dogs: Dog[];
    cards: Card[];
}

export class AppliedCard {
    dogId: string;
    cardId: string;
    targetDogs: TargetDogs[];
}

export class TargetDogs {
    playerId: string;
    dogId: string;
}

export class Game {
    id: string;
    name?: Nullable<string>;
    player1: Player;
    player2?: Nullable<Player>;
    winner?: Nullable<Player>;
    turn?: Nullable<Player>;
    status: GameStatus;
    appliedAttackCard?: Nullable<AppliedCard>;
    eventName?: Nullable<EventName>;
}

export abstract class ISubscription {
    abstract gameUpdates(): Nullable<Game> | Promise<Nullable<Game>>;
}

export class Move {
    player: Player;
    unit: number;
    dog: string;
}

type Nullable<T> = T | null;
