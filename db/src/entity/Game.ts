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

@Entity()
export class Game {
  constructor(joinCode: string, hostId: string) {
    this.joinCode = joinCode;
    this.hostId = hostId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  joinCode: string;

  @OneToMany(() => GameRecord, (gameRecord) => gameRecord.gameId)
  gameRecords: GameRecord[];

  @ManyToOne(() => Profile, (profile) => profile.games)
  @JoinColumn()
  hostId: string;
}
