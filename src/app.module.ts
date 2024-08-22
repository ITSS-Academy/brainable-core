import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProfileModule } from "./profile/profile.module";
import { AuthMiddleware } from "./auth/auth.middleware";
import { QuizModule } from "./quiz/quiz.module";
import { QuestionController } from "./question/question.controller";
import { QuestionModule } from "./question/question.module";
import { GameService } from "./game/game.service";
import { GameController } from "./game/game.controller";
import { GameModule } from "./game/game.module";
import { GameRecordService } from "./game-record/game-record.service";
import { GameRecordController } from "./game-record/game-record.controller";
import { GameRecordModule } from "./game-record/game-record.module";
import { QuestionService } from "./question/question.service";
import { GameGateway } from "./gateway/game/game.gateway";
import { CategoriesService } from "./categories/categories.service";
import { CategoriesController } from "./categories/categories.controller";
import { CategoriesModule } from "./categories/categories.module";

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
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "categories", method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
