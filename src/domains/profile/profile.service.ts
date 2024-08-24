import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProfileDTO } from "../../models/profile.dto";
import { AppDataSource } from "../../../db/src/data-source";
import { Profile } from "../../../db/src/entity/Profile";

@Injectable()
export class ProfileService {
  async create(profile: ProfileDTO) {
    // check if email is valid
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.profile.email)) {
      throw new Error("Invalid email");
    }
    // check if profile already exists
    let result = await AppDataSource.manager.findOne(Profile, {
      where: { uid: profile.profile.email }
    });
    if (result) {
      throw new Error("Profile already exists");
    }

    await AppDataSource.manager.save(profile.profile);
  }

  async getById(uid: string) {
    let result = await AppDataSource.manager.findOne(Profile, {
      where: { uid: uid },
      relations: ["quizzes", "quizzes.questions"]
    });
    if (!result) {
      throw new HttpException("Profile not found", HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(profileDTO: ProfileDTO) {
    let result = await AppDataSource.manager.findOne(Profile, {
      where: { uid: profileDTO.profile.uid }
    });
    if (!result) {
      throw new Error("Profile not found");
    }
    await AppDataSource.manager.save(profileDTO.profile);
  }
}
