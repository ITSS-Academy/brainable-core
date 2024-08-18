import { Module } from '@nestjs/common';
import { GameRecordController } from './game-record.controller';
import { GameRecordService } from './game-record.service';

@Module({
  controllers: [GameRecordController],
  providers: [GameRecordService],
})
export class GameRecordModule {}
