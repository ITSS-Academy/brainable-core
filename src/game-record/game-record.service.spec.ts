import { Test, TestingModule } from '@nestjs/testing';
import { GameRecordService } from './game-record.service';

describe('GameRecordService', () => {
  let service: GameRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRecordService],
    }).compile();

    service = module.get<GameRecordService>(GameRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
