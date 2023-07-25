import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GameStatus } from 'gen/graphql';
import { Base } from './base.entity';
import { Player } from './player.entity';

@Entity()
export class Game extends Base {
  @Column()
  name: string;

  @ManyToOne(() => Player, { nullable: false })
  @JoinColumn({ name: 'player1_id' })
  player1: Player;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player2_id' })
  player2: Player;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'winner_id' })
  winner: Player;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'turn_id' })
  turn: Player;

  @Column({ default: GameStatus.WAITING, type: 'enum', enum: GameStatus })
  status: GameStatus;

  @Column('timestamptz', { nullable: true })
  turnExpiresAt: Date;
}
