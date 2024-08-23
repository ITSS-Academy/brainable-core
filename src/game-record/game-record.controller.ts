import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post
} from "@nestjs/common";
import { GameRecordService } from "./game-record.service";
import { GameRecordDTO } from "../models/gameRecord.dto";
import { GameRecord } from "../../db/src/entity/GameRecord";

@Controller("game-record")
export class GameRecordController {
  constructor(private gameRecord: GameRecordService) {
  }

  @Post()
  async create(@Body() gameRecordDto: GameRecordDTO) {
    try {
      let gameRecord: GameRecordDTO = {
        gameRecord: new GameRecord(
          gameRecordDto.gameRecord.gameId,
          gameRecordDto.gameRecord.questionId,
          gameRecordDto.gameRecord.playerName,
          gameRecordDto.gameRecord.answer
        )
      };
      await this.gameRecord.create(gameRecord);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
