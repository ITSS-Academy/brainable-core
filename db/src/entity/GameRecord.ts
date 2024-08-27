import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Game } from "./Game";
import { Question } from "./Question";

@Entity()
export class GameRecord {
  constructor(
    gameId: string,
    questionId: string,
    playerName: string,
    answer: number
  ) {
    this.gameId = gameId;
    this.questionId = questionId;
    this.playerName = playerName;
    this.answer = answer;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Game, (game) => game.id)
  @JoinColumn({ name: "gameId" })
  gameId: string;

  @OneToOne(() => Question, (question) => question.id)
  @JoinColumn({ name: "questionId" })
  questionId: string;

  @Column()
  playerName: string;

  @Column()
  answer: number;
}
