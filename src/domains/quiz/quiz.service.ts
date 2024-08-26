import { Injectable } from "@nestjs/common";
import { CreateQuizDto } from "../../models/create-quiz.dto";
import { AppDataSource } from "../../../db/src/data-source";
import { Quiz } from "../../../db/src/entity/Quiz";
import { Profile } from "../../../db/src/entity/Profile";
import { Question } from "../../../db/src/entity/Question";
import { UpdateQuizDto } from "../../models/update-quiz.dto";

@Injectable()
export class QuizService {
  async create(quiz: CreateQuizDto, authorId: string) {
    console.log(quiz);
    let author = await AppDataSource.manager.findOne(Profile, {
      where: { uid: authorId }
    });
    if (!author) {
      throw new Error("Author not found");
    }
    if (!quiz.quiz.imgUrl || quiz.quiz.imgUrl === "") {
      quiz.quiz.imgUrl = "https://firebasestorage.googleapis.com/v0/b/brainable-d5919.appspot.com/o/media.png?alt=media&token=b7bc0b71-587d-4dd3-932f-98ccb390bf6e";
    }
    const newQuiz = await AppDataSource.manager.save(Quiz, {
      ...quiz.quiz,
      authorId: author,
      questions: []
    });

    const questions = quiz.quiz.questions.map(async question => {
      // check if timeLimit is 0 or null and set it 10
      if (!question.timeLimit || question.timeLimit === 0) {
        question.timeLimit = 10;
      }
      if (!question.imgUrl || question.imgUrl === "") {
        question.imgUrl = "https://firebasestorage.googleapis.com/v0/b/brainable-d5919.appspot.com/o/media.png?alt=media&token=b7bc0b71-587d-4dd3-932f-98ccb390bf6e";
      }
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

  async update(quiz: UpdateQuizDto) {
    console.log(quiz);
    let quizToUpdate = await AppDataSource.manager.findOne(Quiz, {
      where: { id: quiz.quiz.id }
    });
    if (!quizToUpdate) {
      throw new Error("Quiz not found");
    }

    if (!quiz.quiz.imgUrl || quiz.quiz.imgUrl === "") {
      quiz.quiz.imgUrl = "https://firebasestorage.googleapis.com/v0/b/brainable-d5919.appspot.com/o/media.png?alt=media&token=b7bc0b71-587d-4dd3-932f-98ccb390bf6e";
    }

    await AppDataSource.manager.update(Quiz, quiz.quiz.id, {
      title: quiz.quiz.title,
      description: quiz.quiz.description,
      isPublic: quiz.quiz.isPublic,
      imgUrl: quiz.quiz.imgUrl
    });


    const questions = quiz.quiz.questions.map(async question => {
      // check if timeLimit is 0 or null and set it 10
      if (!question.timeLimit || question.timeLimit === 0) {
        question.timeLimit = 10;
      }
      if (!question.imgUrl || question.imgUrl === "") {
        question.imgUrl = "https://firebasestorage.googleapis.com/v0/b/brainable-d5919.appspot.com/o/media.png?alt=media&token=b7bc0b71-587d-4dd3-932f-98ccb390bf6e";
      }
      if (question.id) {
        await AppDataSource.manager.update(Question, question.id, {
          ...question
        });
      } else {
        await AppDataSource.manager.save(Question, {
          ...question,
          quizId: quizToUpdate
        });
      }
    });

    await Promise.all(questions);
    return quizToUpdate;
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
