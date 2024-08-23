import { Injectable } from "@nestjs/common";
import { QuizDTO } from "../models/quiz.dto";
import { AppDataSource } from "../../db/src/data-source";
import { Quiz } from "../../db/src/entity/Quiz";
import { Profile } from "../../db/src/entity/Profile";
import { Question } from "../../db/src/entity/Question";

@Injectable()
export class QuizService {
  async create(quiz: QuizDTO, authorId: string) {
    let author = await AppDataSource.manager.findOne(Profile, {
      where: { uid: authorId }
    });
    if (!author) {
      throw new Error("Author not found");
    }
    const newQuiz = await AppDataSource.manager.save(Quiz, {
      ...quiz.quiz,
      authorId: author,
      questions: []
    });

    const questions = quiz.quiz.questions.map(async question => {
      return await AppDataSource.manager.save(Question, {
        ...question,
        quizId: newQuiz
      });
    });

    await Promise.all(questions);


    return newQuiz;
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
