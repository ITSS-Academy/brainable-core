import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Quiz } from './Quiz';
import { Game } from './Game';

@Entity()
export class Profile {
  constructor(uid: string, fullName: string, email: string, photoUrl: string) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.photoUrl = photoUrl;
  }

  @PrimaryColumn()
  uid: string;

  @Column()
  fullName: string;

  @PrimaryColumn()
  email: string;

  @Column()
  photoUrl: string;

  @OneToMany(() => Quiz, (quiz) => quiz.authorId)
  quizzes: Quiz[];

  @OneToMany(() => Game, (game) => game.hostId)
  games: Game[];
}
