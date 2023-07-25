import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { Game } from './game.entity';
import { Player } from './player.entity';

@Entity()
export class Move extends Base {
  @ManyToOne(() => Player, { nullable: false })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Game, { nullable: false })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column('int')
  unit: number;

  @Column()
  dog: string;
}
