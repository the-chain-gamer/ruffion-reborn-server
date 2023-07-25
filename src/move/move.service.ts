import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Move } from 'gen/db';

@Injectable()
export class MoveService {
  constructor(@InjectRepository(Move) private moveRepo: Repository<Move>) {}

  async all(whereInput: FindOptionsWhere<Move>): Promise<Move[] | null> {
    return this.moveRepo.find({
      where: whereInput,
      relations: { player: true },
      order: { createdAt: 'desc' },
    })
  }

  async save(createInput: DeepPartial<Move>): Promise<Move | null> {
    return this.moveRepo.save(createInput);
  }
}
