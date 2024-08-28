import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppDataSource } from "../../../db/src/data-source";
import { GameDTO } from "../../models/game.dto";
import { Game } from "db/src/entity/Game";

@Injectable()
export class GameService {
  async create(game: GameDTO) {
    await AppDataSource.manager.save(Game,{
      joinCode: game.game.joinCode,
      hostId: game.game.hostId,
      quizId: game.game.quizId
    });
  }

  async getByHostId(id: string) {
    let result = await AppDataSource.manager.find(Game, {
      where: { hostId: id },
      relations: ["gameRecords","quizId","quizId.questions"],
    })
    return result.map(game => ({
      ...game,
      totalQuestions: game.quizId.questions.length
    }));
  }

  async getById(id: string) {
    let result = await AppDataSource.manager.findOne(Game, {
      where: { id: id },
      relations: ["gameRecords","quizId", 'quizId.questions'],
    });

    if (!result) {
      throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
    }
    return {
      ...result,
      totalQuestions: result.quizId.questions.length

    }
  }
}
