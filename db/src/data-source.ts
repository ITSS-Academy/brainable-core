import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entity/Profile";
import { Quiz } from "./entity/Quiz";
import { Question } from "./entity/Question";
import { Game } from "./entity/Game";
import { GameRecord } from "./entity/GameRecord";
import { Categories } from "./entity/Categories";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "dpg-cqq9p02j1k6c73de1k60-a.singapore-postgres.render.com",
  port: 5432,
  username: "miruku",
  password: "GfTMWxywh6YtDOeTfQ0nScA5RyFIkrc1",
  database: "brainable_postgresql",
  synchronize: true,
  logging: false,
  entities: [Profile, Quiz, Question, Game, GameRecord, Categories],
  migrations: [],
  subscribers: [],
  ssl: { rejectUnauthorized: false }
});
