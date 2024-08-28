import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppDataSource } from 'db/src/data-source';
import { QuestionRecord } from 'db/src/entity/QuestionRecord';
import { QuestionRecordDTO } from 'src/models/question-record.dto';

@Injectable()
export class QuestionRecordService {
  async create(questionRecordDto: QuestionRecordDTO) {
    return await AppDataSource.manager.save(questionRecordDto.questionRecord);
  }

  async getByQuestionId(id: string) {
    return await AppDataSource.manager.findOne(QuestionRecord, {
      where: {
        question: {
          id: id,
        },
      },
      relations: {
        question: true,
      },
    });
  }

  async getByGameId(id: string) {
    let result = await AppDataSource.manager.find(QuestionRecord, {
      where: { gameId: id },
      relations: ['question'],
    });

    if (!result) {
      throw new HttpException('QuestionRecord not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
