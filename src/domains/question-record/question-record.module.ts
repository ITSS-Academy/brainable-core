import { Module } from '@nestjs/common';
import { QuestionRecordService } from './question-record.service';
import { QuestionRecordController } from './question-record.controller';

@Module({
  controllers: [QuestionRecordController],
  providers: [QuestionRecordService],
})
export class QuestionRecordModule {}
