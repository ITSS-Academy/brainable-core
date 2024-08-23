import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req
} from "@nestjs/common";

import { DecodedIdToken } from "firebase-admin/lib/auth";
import { QuizDTO } from "../models/quiz.dto";
import { Quiz } from "../../db/src/entity/Quiz";
import { QuizService } from "./quiz.service";

@Controller("quiz")
export class QuizController {
  constructor(private quizService: QuizService) {
  }

  @Post()
  async createQuiz(@Req() req: any, @Body() quizDto: QuizDTO) {
    try {
      let authData = req.user as DecodedIdToken;
      let quiz: QuizDTO = {
        quiz: new Quiz(
          quizDto.quiz.title,
          quizDto.quiz.description,
          quizDto.quiz.isPublic,
          quizDto.quiz.category,
          quizDto.quiz.imgUrl,
          quizDto.quiz.questions
        )
      };

      await this.quizService.create(quiz, authData.uid);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getQuiz(@Req() req: any) {
    try {
      let authData = req.user as DecodedIdToken;
      return await this.quizService.getByAuthorId(authData.uid);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":id")
  async getQuizById(@Param("id") id: string) {
    try {
      return await this.quizService.getById(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updateQuiz(@Req() req: any, @Body() quizDTO: QuizDTO) {
    try {
      let authData = req.user as DecodedIdToken;

      let quiz: QuizDTO = {
        quiz: new Quiz(
          quizDTO.quiz.title,
          quizDTO.quiz.description,
          quizDTO.quiz.isPublic,
          quizDTO.quiz.category,
          quizDTO.quiz.imgUrl,
          quizDTO.quiz.questions
        )
      };

      await this.quizService.update(quiz);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(":id")
  async deleteQuiz(@Param("id") id: string) {
    try {
      await this.quizService.delete(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
