import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameDTO } from '../models/game.dto';
import { Game } from '../../db/src/entity/Game';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async create(@Req() req: any, @Body() gameDto: GameDTO) {
    try {
      let user = req.user;
      let game: GameDTO = {
        game: new Game(gameDto.game.joinCode, user.uid),
      };
      await this.gameService.create(game);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
