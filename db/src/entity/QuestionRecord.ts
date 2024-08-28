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
    constructor() {}
  
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @ManyToOne(() => Game, (game) => game.questionRecords)
    // @JoinColumn({ name: "gameId" })
    @Column()
    gameId: string
  
    @ManyToOne(() => Question)
    @JoinColumn()
    question: Question;

    @Column({default: 0})
    countA: number;

    @Column({default: 0})
    countB: number;

    @Column({default: 0})
    countC: number;

    @Column({default: 0})
    countD: number;

  }
  