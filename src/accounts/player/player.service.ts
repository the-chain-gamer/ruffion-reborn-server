import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Player } from 'gen/db';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepo: Repository<Player>,
  ) {}

  async save(createInput: DeepPartial<Player>): Promise<Player | null> {
    return this.playerRepo.save(createInput);
  }

  async get(whereInput: FindOptionsWhere<Player>): Promise<Player | null> {
    return this.playerRepo.findOne({ where: whereInput });
  }
}
