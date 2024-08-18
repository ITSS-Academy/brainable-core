import { Injectable } from "@nestjs/common";
import { CategoriesDTO } from "../models/categories.dto";
import { Categories } from "../../db/src/entity/Categories";
import { AppDataSource } from "../../db/src/data-source";

@Injectable()
export class CategoriesService {
  async create(category: CategoriesDTO) {
    let categoryExists = await AppDataSource.manager.findOne(Categories, { where: { name: category.categories.name } });
    if (categoryExists) {
      throw new Error("Category already exists");
    }
    await AppDataSource.manager.save(category.categories);


  }

  async getCategoryById(id: string) {
    return await AppDataSource.manager.find(Categories, {
      where: { uid: id },
      relations: ["quizzes"]
    });
  }

  async getAllCategories() {
    return await AppDataSource.manager.find(Categories);
  }
  
}
