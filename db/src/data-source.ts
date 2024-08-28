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
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  port: 6543,
  username: "postgres.iwfxqtcckjksxjspigqf",
  password: "DHjTMZ4QJRBlUwMs",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [Profile, Quiz, Question, Game, GameRecord, Categories],
  migrations: [],
  subscribers: [],
  ssl: { rejectUnauthorized: false }
});
