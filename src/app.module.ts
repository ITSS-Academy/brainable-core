import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProfileModule } from "./domains/profile/profile.module";
import { AuthMiddleware } from "./domains/auth/auth.middleware";
import { QuizModule } from "./domains/quiz/quiz.module";
import { QuestionModule } from "./domains/question/question.module";
import { GameModule } from "./domains/game/game.module";
import { GameRecordModule } from "./domains/game-record/game-record.module";
import { GameGateway } from "./gateway/game/game.gateway";
import { CategoriesModule } from "./domains/categories/categories.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    ProfileModule,
    QuizModule,
    QuestionModule,
    GameModule,
    GameRecordModule,
    CategoriesModule,
    SearchModule
  ],
  controllers: [
    AppController
  ],
  providers: [AppService, GameGateway]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "categories", method: RequestMethod.ALL },
        { path: "categories/:id", method: RequestMethod.ALL },
        { path: "search", method: RequestMethod.ALL }
      )
      .forRoutes("*");
  }
}
