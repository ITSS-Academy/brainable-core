import { Test, TestingModule } from '@nestjs/testing';
import { QuestionRecordController } from './question-record.controller';
import { QuestionRecordService } from './question-record.service';

describe('QuestionRecordController', () => {
  let controller: QuestionRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionRecordController],
      providers: [QuestionRecordService],
    }).compile();

    controller = module.get<QuestionRecordController>(QuestionRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
