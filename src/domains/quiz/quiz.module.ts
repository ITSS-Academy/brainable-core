import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { SearchModule } from "../../search/search.module";

@Module({
  imports: [
    SearchModule
  ],
  providers: [QuizService],
  controllers: [QuizController]
})
export class QuizModule {
}
