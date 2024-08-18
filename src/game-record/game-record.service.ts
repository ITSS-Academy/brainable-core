import { Injectable } from '@nestjs/common';
import { GameRecordDTO } from '../models/gameRecord.dto';
import { AppDataSource } from '../../db/src/data-source';

@Injectable()
export class GameRecordService {
  async create(gameRecord: GameRecordDTO) {
    await AppDataSource.manager.save(gameRecord);
  }
}
