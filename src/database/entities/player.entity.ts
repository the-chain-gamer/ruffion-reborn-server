import { Entity, Column} from 'typeorm';
import {Base} from "./base.entity";

@Entity()
export class Player extends Base {

  @Column('citext', { unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'int',default:0 })
  turnNo: number;
}
