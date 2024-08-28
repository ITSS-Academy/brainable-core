import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { GameRecord } from "./GameRecord";
import { Profile } from "./Profile";
import { Quiz } from "./Quiz";

@Entity()
export class Game {
  constructor(joinCode: string) {
    this.joinCode = joinCode;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  joinCode: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.id)
  @JoinColumn({ name: "quizId" })
  quizId: Quiz;

  @OneToMany(() => GameRecord, (gameRecord) => gameRecord.gameId)
  gameRecords: GameRecord[];

  @Column({ name: "hostId" })
  hostId: string;
}
