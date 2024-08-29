import { Injectable } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";
import { Quiz } from "../../db/src/entity/Quiz";

@Injectable()
export class SearchService {

  private readonly esClient: Client;

  constructor() {
    this.esClient = new Client({
      node: "https://es.ext.akademy.dev/"
      // auth: {
      //   apiKey: "N2dBT1hKRUJKQnlacDY0UXNIeDQ6cnhBN25RY1BSRy1zV2ppNFJxc3I2UQ==",
      //   username: "elastic",
      //   password: "NIYdXqHVOSaOry0THa9eFrBZ"
      // }
    });

    console.log("esClient", this.esClient);
  }

  async indexQuiz(quiz: Quiz) {
    await this.esClient.index({
      index: "kadick_quiz",
      id: quiz.id,
      document: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        isPublic: quiz.isPublic,
        imgUrl: quiz.imgUrl,
        authorId: quiz.authorId,
        category: quiz.category,
        questions: quiz.questions
      }
    });
  }


  async searchQuiz(query: string) {
    // search for profiles by username or email or uid
    const response = await this.esClient.search({
      index: "kadick_quiz",
      query: {
        multi_match: {
          query: query,
          fields: ["*"]
        }
      }
    });
    return response.hits.hits;
  }

  async removeQuiz(id: string) {
    await this.esClient.delete({
      index: "kadick_quiz",
      id: id
    });
  }

  async updateQuiz(quiz: Quiz) {
    // delete first
    await this.removeQuiz(quiz.id);
    // index
    await this.indexQuiz(quiz);
  }


}
