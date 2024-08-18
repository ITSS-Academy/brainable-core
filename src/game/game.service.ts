import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../../db/src/data-source';
import { GameDTO } from '../models/game.dto';

@Injectable()
export class GameService {
  async create(game: GameDTO) {
    await AppDataSource.manager.save(game);
  }
}
