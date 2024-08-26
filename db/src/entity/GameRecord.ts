import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game';
import { Question } from './Question';

@Entity()
export class GameRecord {
  constructor(
    gameId: string,
    score: number,
    correctCount: number,
    playerName: string,
  ) {
    this.gameId = gameId;
    this.score = score;
    this.correctCount = correctCount;
    this.playerName = playerName;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.id)
  @JoinColumn()
  gameId: string;

  @Column()
  score: number;

  @Column()
  correctCount: number;

  // @OneToOne(() => Question, (question) => question.id)
  // @JoinColumn()
  // questionId: string;

  @Column()
  playerName: string;
}
