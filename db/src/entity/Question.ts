import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Quiz } from "./Quiz";

@Entity()
export class Question {
  constructor(
    question: string,
    answer: number,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
    imgUrl: string,
    timeLimit: number,
    points: number
  ) {
    this.question = question;
    this.answer = answer;
    this.option1 = option1;
    this.option2 = option2;
    this.option3 = option3;
    this.option4 = option4;
    this.imgUrl = imgUrl;
    this.timeLimit = timeLimit;
    this.points = points;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  question: string;

  @Column()
  answer: number;

  @Column()
  option1: string;

  @Column()
  option2: string;

  @Column()
  option3: string;

  @Column()
  option4: string;

  @Column()
  timeLimit: number;

  @Column()
  points: number;

  @Column()
  imgUrl: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quizId" })
  quizId: Quiz;
}
