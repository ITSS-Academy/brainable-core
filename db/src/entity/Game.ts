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
import { QuestionRecord } from "./QuestionRecord";

@Entity()
export class Game {
  constructor(joinCode: string, quizId: Quiz) {
    this.joinCode = joinCode;
    this.quizId = quizId;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  joinCode: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE'}  )
  @JoinColumn({ name: "quizId" })
  quizId: Quiz;

  @OneToMany(() => GameRecord, (gameRecord) => gameRecord.gameId, { cascade: true, onDelete: "CASCADE" })
  gameRecords: GameRecord[];

  @OneToMany(() => QuestionRecord, (questionRecord) => questionRecord.gameId, { cascade: true, onDelete: "CASCADE" })
  questionRecords: QuestionRecord[];

  @Column({ name: "hostId" })
  hostId: string;
}
