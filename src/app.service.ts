import { Injectable } from "@nestjs/common";
import { AppDataSource } from "../db/src/data-source";

@Injectable()
export class AppService {
  initDb() {
    AppDataSource.initialize()
      .then(async () => {
      })
      .catch((error) => console.log(error));
  }

}
