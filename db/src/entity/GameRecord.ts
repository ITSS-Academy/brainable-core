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

  @ManyToOne(() => Game, (game) => game.gameRecords)
  @JoinColumn({ name: 'gameId' })
  gameId: string;

  @Column({default: 0})
  score: number;

  @Column({default: 0})
  correctCount: number;

  @Column({default: 0})
  incorrectCount: number;

  @Column({default: 0})
  noAnswerCount: number;

  @Column()
  playerName: string;
}
