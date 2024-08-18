import { Injectable } from "@nestjs/common";
import { QuizDTO } from "../models/quiz.dto";
import { AppDataSource } from "../../db/src/data-source";
import { Quiz } from "../../db/src/entity/Quiz";
import { Profile } from "../../db/src/entity/Profile";

@Injectable()
export class QuizService {
  async create(quiz: QuizDTO, authorId: string) {
    let author = await AppDataSource.manager.findOne(Profile, {
      where: { uid: authorId }
    });
    if (!author) {
      throw new Error("Author not found");
    }
    quiz.quiz.authorId = author;
    await AppDataSource.manager.save(quiz.quiz);
  }

  async getByAuthorId(id: string) {
    let author = await AppDataSource.manager.findOne(Profile, {
      where: { uid: id }
    });
    if (!author) {
      throw new Error("Author not found");
    }
    const quizzes = await AppDataSource.manager.find(Quiz, {
      where: { authorId: author },
      relations: ["questions", "category"],
      order: { createdAt: "ASC", questions: { createdAt: "ASC" } }
    });

    quizzes.forEach(quiz => {
      quiz["totalQuestions"] = quiz.questions.length;
    });

    return quizzes;
  }

  async getById(id: string) {
    let quiz = await AppDataSource.manager.findOne(Quiz, {
      where: { id: id },
      relations: ["questions", "category"],
      order: { createdAt: "ASC", questions: { createdAt: "ASC" } }
    });
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    return quiz;
  }

  async update(quizDto: QuizDTO) {
    let quiz = await AppDataSource.manager.findOne(Quiz, {
      where: { id: quizDto.quiz.id }
    });
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    await AppDataSource.manager.update(Quiz, quizDto.quiz.id, quizDto.quiz);
  }

  async delete(id: string) {
    let quiz = await AppDataSource.manager.findOne(Quiz, {
      where: { id: id }
    });
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    await AppDataSource.manager.delete(Quiz, id);
  }
}
