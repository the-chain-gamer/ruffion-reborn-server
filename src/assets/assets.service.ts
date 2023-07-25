import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Assets } from 'gen/db';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Assets) private assetsRepo: Repository<Assets>) {}

  async getAssets(whereInput: FindOptionsWhere<Assets>): Promise<Assets | null> {
    return this.assetsRepo.findOneBy(whereInput);
  }

  async save(createInput: DeepPartial<Assets>): Promise<Assets | null> {
    return this.assetsRepo.save(createInput);
  }
}
