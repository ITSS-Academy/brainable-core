import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./Quiz";

@Entity()
export class Categories {
  constructor(name: string, imgUrl: string) {
    this.name = name;
    this.imgUrl = imgUrl;
  }

  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column()
  name: string;

  @Column()
  imgUrl: string;

  @OneToMany(() => Quiz, (quiz) => quiz.category)
  quizzes: Quiz[];
}
