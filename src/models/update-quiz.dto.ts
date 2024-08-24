import { Question } from "../../db/src/entity/Question";
import { Categories } from "../../db/src/entity/Categories";

export interface UpdateQuizDto {
  quiz: {
    id: string;
    title: string;
    description: string;
    isPublic: boolean;
    totalQuestions: number;
    imgUrl: string;
    createdAt: Date;
    category: string;
    questions: Question[];
  };
}
