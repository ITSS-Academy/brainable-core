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
  Req, UploadedFiles, UseInterceptors
} from "@nestjs/common";

import { DecodedIdToken } from "firebase-admin/lib/auth";
import { CreateQuizDto } from "../../models/create-quiz.dto";
import { Quiz } from "../../../db/src/entity/Quiz";
import { QuizService } from "./quiz.service";
import { UpdateQuizDto } from "../../models/update-quiz.dto";
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller("quiz")
export class QuizController {
  constructor(private quizService: QuizService) {
  }

  @Post()
  @UseInterceptors(FilesInterceptor('imageUrl'))
  async createQuiz(@Req() req: any, @Body() quizDto: CreateQuizDto) {
    try {
      let authData = req.user as DecodedIdToken;
      let quiz: CreateQuizDto = {
        quiz: new Quiz(
          quizDto.quiz.title,
          quizDto.quiz.description,
          quizDto.quiz.isPublic,
          quizDto.quiz.category,
          quizDto.quiz.imgUrl,
          quizDto.quiz.questions
        )
      };
      console.log(quiz);
      await this.quizService.create(quiz, authData.uid);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
  async updateQuiz(@Req() req: any, @Body() quizDTO: UpdateQuizDto) {
    try {
      await this.quizService.update(quizDTO);
    } catch (error) {
      console.log(error);
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(":id")
  async deleteQuiz(@Param("id") id: string) {
    try {
      await this.quizService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
