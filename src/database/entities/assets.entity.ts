import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Card, Dog } from 'gen/graphql';
import { Base } from './base.entity';
import { Player } from './player.entity';

@Entity()
export class Assets extends Base {
  @OneToOne(() => Player, { nullable: false })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column('jsonb')
  cards: Array<Card>;

  @Column('jsonb')
  dogs: Array<Dog>;
}
