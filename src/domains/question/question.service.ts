import { Injectable } from "@nestjs/common";
import { QuestionDTO } from "../../models/question.dto";
import { AppDataSource } from "../../../db/src/data-source";
import { Question } from "../../../db/src/entity/Question";

@Injectable()
export class QuestionService {
  async create(questions: { question: Question }[]) {
    for (const questionDto of questions) {
      await AppDataSource.manager.save(questionDto.question);
    }
  }

  // async update(questionDto: QuestionDTO) {
  //   let question = await AppDataSource.manager.findOne(Question, {
  //     where: { id: questionDto.question.id }
  //   });
  //   if (!question) {
  //     throw new Error("Question not found");
  //   }
  //
  //   await AppDataSource.manager.update(
  //     Question,
  //     questionDto.question.id,
  //     questionDto.question
  //   );
  // }

  async delete(id: string) {
    let question = await AppDataSource.manager.findOne(Question, {
      where: { id: id }
    });
    if (!question) {
      throw new Error("Question not found");
    }

    await AppDataSource.manager.delete(Question, id);
  }
}
