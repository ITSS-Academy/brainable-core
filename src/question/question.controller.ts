import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionDTO } from "../models/question.dto";
import { Question } from "../../db/src/entity/Question";

@Controller("question")
export class QuestionController {
  constructor(private questionService: QuestionService) {
  }

  @Post()
  async createQuestion(@Body() questionDto: QuestionDTO) {

    try {
      let question: { question: Question }[] = questionDto.question.map(
        (question) => {
          return {
            question: new Question(
              question.question,
              question.answer,
              question.option1,
              question.option2,
              question.option3,
              question.option4,
              question.imgUrl,
              question.timeLimit,
              question.quizId
            )
          };
        }
      );
      await this.questionService.create(question);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Put()
  // async updateQuestion(@Body() questionDto: QuestionDTO) {
  //   try {
  //     let question: QuestionDTO = {
  //       question: new Question(
  //         questionDto.question.question,
  //         questionDto.question.answer,
  //         questionDto.question.option1,
  //         questionDto.question.option2,
  //         questionDto.question.option3,
  //         questionDto.question.option4,
  //         questionDto.question.imgUrl,
  //         questionDto.question.timeLimit,
  //         questionDto.question.quizId
  //       )
  //     };
  //     await this.questionService.update(question);
  //   } catch (error) {
  //     return new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Delete(":id")
  async deleteQuestion(@Param("id") id: string) {
    try {
      await this.questionService.delete(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
