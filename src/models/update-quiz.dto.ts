import { Question } from "../../db/src/entity/Question";

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
