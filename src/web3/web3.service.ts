import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  web3: Web3;

  constructor() {
    this.web3 = new Web3();
  }
}
