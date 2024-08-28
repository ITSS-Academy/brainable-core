import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./entity/Profile";
import { Quiz } from "./entity/Quiz";
import { Question } from "./entity/Question";
import { Game } from "./entity/Game";
import { GameRecord } from "./entity/GameRecord";
import { Categories } from "./entity/Categories";
import { QuestionRecord } from "./entity/QuestionRecord";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "dpg-cr5vg32j1k6c7399d6n0-a.singapore-postgres.render.com",
  port: 5432,
  username: "gideon",
  password: "ocaps5DoErpA03dYkUJ4BwJC5We6a8JX",
  database: "brainable_gideon",
  synchronize: true,
  logging: false,
  entities: [Profile, Quiz, Question, Game, GameRecord, Categories, QuestionRecord],
  migrations: [],
  subscribers: [],
  ssl: { rejectUnauthorized: false }
});
