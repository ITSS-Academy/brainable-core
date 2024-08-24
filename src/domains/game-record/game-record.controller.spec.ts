import { Test, TestingModule } from '@nestjs/testing';
import { GameRecordController } from './game-record.controller';

describe('GameRecordController', () => {
  let controller: GameRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameRecordController],
    }).compile();

    controller = module.get<GameRecordController>(GameRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
