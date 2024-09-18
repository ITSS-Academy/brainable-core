import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from "@nestjs/common";
import { SearchService } from "./search.service";
import { CreateSearchDto } from "./dto/create-search.dto";
import { UpdateSearchDto } from "./dto/update-search.dto";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {
  }

  @Get()
  findAll(@Query("q") q: string) {
    try {
      return this.searchService.searchQuiz(q);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  remove(@Param("id") id: string) {
    try {
      return this.searchService.deleteAll();
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
