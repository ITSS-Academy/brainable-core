import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProfileModule } from "./domains/profile/profile.module";
import { AuthMiddleware } from "./domains/auth/auth.middleware";
import { QuizModule } from "./domains/quiz/quiz.module";
import { QuestionController } from "./domains/question/question.controller";
import { QuestionModule } from "./domains/question/question.module";
import { GameService } from "./domains/game/game.service";
import { GameController } from "./domains/game/game.controller";
import { GameModule } from "./domains/game/game.module";
import { GameRecordService } from "./domains/game-record/game-record.service";
import { GameRecordController } from "./domains/game-record/game-record.controller";
import { GameRecordModule } from "./domains/game-record/game-record.module";
import { QuestionService } from "./domains/question/question.service";
import { GameGateway } from "./gateway/game/game.gateway";
import { CategoriesService } from "./domains/categories/categories.service";
import { CategoriesController } from "./domains/categories/categories.controller";
import { CategoriesModule } from "./domains/categories/categories.module";

@Module({
  imports: [
    ProfileModule,
    QuizModule,
    QuestionModule,
    GameModule,
    GameRecordModule,
    CategoriesModule
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
        { path: "categories", method: RequestMethod.ALL }
      )
      .forRoutes("*");
  }
}
