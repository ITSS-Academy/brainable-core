import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Profile } from "./Profile";
import { Question } from "./Question";
import { type } from "node:os";
import { Categories } from "./Categories";
import { Game } from "./Game";

@Entity()
export class Quiz {
  constructor(title: string, description: string, isPublic: boolean, category: string, imgUrl: string, questions: Question[]) {
    this.title = title;
    this.description = description;
    this.isPublic = isPublic;
    this.imgUrl = imgUrl;
    this.category = category;
    this.questions = questions;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({nullable: true})
  description: string;

  @Column()
  isPublic: boolean;

  @Column()
  imgUrl: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.uid)
  @JoinColumn([
    { name: "authorUid", referencedColumnName: "uid" },
    { name: "authorEmail", referencedColumnName: "email" }
  ])
  authorId: Profile;

  @OneToMany(() => Question, (question) => question.quizId, { cascade: true, onDelete: "CASCADE" })
  questions: Question[];

  @ManyToOne(() => Categories, (category) => category.uid, { nullable: true })
  @JoinColumn({ name: "categoryId" })
  category: string;
}
