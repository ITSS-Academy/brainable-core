import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GameRecordDTO } from "../../models/gameRecord.dto";
import { AppDataSource } from "../../../db/src/data-source";
import { GameRecord } from "db/src/entity/GameRecord";

@Injectable()
export class GameRecordService {
  async create(gameRecord: GameRecordDTO) {
    await AppDataSource.manager.save(gameRecord.gameRecord);
  }

  async getById(id: string)  {
    let result = await AppDataSource.manager.findOne(GameRecord, {
      where: { id: id },
    });
    if (!result) {
      throw new HttpException("Game record not found", HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
