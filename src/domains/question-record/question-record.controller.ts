import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query
} from "@nestjs/common";
import { QuestionRecordService } from "./question-record.service";
import { QuestionRecordDTO } from "src/models/question-record.dto";
import { QuestionRecord } from "db/src/entity/QuestionRecord";

@Controller("question-record")
export class QuestionRecordController {
  constructor(private readonly questionRecordService: QuestionRecordService) {
  }

  @Post()
  async create(@Body() questionRecordDto: QuestionRecordDTO) {
    console.log(questionRecordDto);
    try {
      let questionRecord: QuestionRecordDTO = {
        questionRecord: new QuestionRecord(
          questionRecordDto.questionRecord.gameId,
          questionRecordDto.questionRecord.question,
          questionRecordDto.questionRecord.countA,
          questionRecordDto.questionRecord.countB,
          questionRecordDto.questionRecord.countC,
          questionRecordDto.questionRecord.countD
        )
      };

      await this.questionRecordService.create(questionRecord);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get("byQuestionId")
  async getByQuestionId(@Query("id") id: string) {
    try {
      return await this.questionRecordService.getByQuestionId(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get("byGameId")
  async getByGameId(@Query("id") id: string) {
    try {
      return await this.questionRecordService.getByGameId(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // @Get()
  // findAll() {
  //   return this.questionRecordService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.questionRecordService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateQuestionRecordDto: UpdateQuestionRecordDto) {
  //   return this.questionRecordService.update(+id, updateQuestionRecordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.questionRecordService.remove(+id);
  // }
}
