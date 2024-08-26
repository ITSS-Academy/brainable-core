import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../../../db/src/data-source";
import { GameDTO } from "../../models/game.dto";
import { Game } from "db/src/entity/Game";

@Injectable()
export class GameService {
  async create(game: GameDTO) {
    await AppDataSource.manager.save(Game,{
      joinCode: game.game.joinCode,
      quizId: game.game.quizId,
      hostId: game.game.hostId,
    });
  }

  async getByHostId(id: string) {
    return await AppDataSource.manager.find(Game, {
      where: { hostId: id },
      relations: ["gameRecords","quizId"],
    })
  }
}
