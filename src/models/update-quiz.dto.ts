import { Question } from "../../db/src/entity/Question";
import { Profile } from "../../db/src/entity/Profile";

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
    authorId: Profile;
    questions: Question[];
  };
}
