import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req
} from "@nestjs/common";
import { GameRecordService } from "./game-record.service";
import { GameRecordDTO } from "../../models/gameRecord.dto";
import { GameRecord } from "../../../db/src/entity/GameRecord";

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
          gameRecordDto.gameRecord.score,
          gameRecordDto.gameRecord.correctCount,
          gameRecordDto.gameRecord.playerName,
        )
      };
      // gameRecord.gameRecord.incorrectCount = gameRecordDto.gameRecord.incorrectCount;
      // gameRecord.gameRecord.noAnswerCount = gameRecordDto.gameRecord.noAnswerCount;
      await this.gameRecord.create(gameRecord);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getById(@Req() req:any, @Query("id") id: string){
    try{
      return await this.gameRecord.getById(id);
    }catch(error){
      return new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
