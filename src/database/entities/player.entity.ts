import { Entity, Column} from 'typeorm';
import {Base} from "./base.entity";
import {PlayerType} from "../../../gen/graphql";

@Entity()
export class Player extends Base {

  @Column({default:PlayerType.User, type:'enum', enum:PlayerType})
  playerType:PlayerType

  @Column('citext', { unique: true,nullable:true })
  email: string;

  @Column({nullable:true})
  firstName: string;

  @Column({nullable:true})
  lastName: string;

  @Column({ type: 'int',default:0 })
  turnNo: number;
}
