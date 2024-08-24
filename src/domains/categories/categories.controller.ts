import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesDTO } from "../../models/categories.dto";
import { DecodedIdToken } from "firebase-admin/lib/auth";
import { Categories } from "../../../db/src/entity/Categories";

@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {
  }

  @Get()
  async getAllCategories() {
    try {
      return await this.categoriesService.getAllCategories();
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createCategory(@Body() categoryDto: CategoriesDTO) {
    try {
      let category: CategoriesDTO = {
        categories: new Categories(
          categoryDto.categories.name,
          categoryDto.categories.imgUrl
        )
      };

      await this.categoriesService.create(category);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":id")
  async getCategories(@Param("id") id: string) {
    try {
      await this.categoriesService.getCategoryById(id);
      return await this.categoriesService.getCategoryById(id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
