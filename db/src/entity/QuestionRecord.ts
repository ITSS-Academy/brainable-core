import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Question } from "./Question";
import { Game } from "./Game";

@Entity()
export class QuestionRecord {
  constructor(
    gameId: string,
    question: Question,
    countA: number,
    countB: number,
    countC: number,
    countD: number
  ) {
    this.gameId = gameId;
    this.question = question;
    this.countA = countA;
    this.countB = countB;
    this.countC = countC;
    this.countD = countD;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  gameId: string;

  @ManyToOne(() => Question, (question) => question.id , { cascade: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "questionId" })
  question: Question;

  @Column({ default: 0 })
  countA: number;

  @Column({ default: 0 })
  countB: number;

  @Column({ default: 0 })
  countC: number;

  @Column({ default: 0 })
  countD: number;

}
