import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameRecord } from './GameRecord';
import { Profile } from './Profile';
import { Quiz } from './Quiz';

@Entity()
export class Game {
  constructor(joinCode: string, quizId: string) {
    this.joinCode = joinCode;
    this.quizId = quizId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  joinCode: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.id)
  @JoinColumn({ name: 'quizId' })
  quizId: string;

  @OneToMany(() => GameRecord, (gameRecord) => gameRecord.gameId)
  gameRecords: GameRecord[];


  // @ManyToOne(() => Profile, (profile) => profile.games)
  @Column({ name: 'hostId' })
  hostId: string;
}
