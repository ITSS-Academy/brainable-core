import { Test, TestingModule } from '@nestjs/testing';
import { QuestionRecordService } from './question-record.service';

describe('QuestionRecordService', () => {
  let service: QuestionRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionRecordService],
    }).compile();

    service = module.get<QuestionRecordService>(QuestionRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
