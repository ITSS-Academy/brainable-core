import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileDTO } from "../../models/profile.dto";
import { DecodedIdToken } from "firebase-admin/lib/auth";
import { Profile } from "../../../db/src/entity/Profile";

@Controller("profile")
export class ProfileController {
  constructor(private profileService: ProfileService) {
  }

  @Post()
  async createProfile(@Req() req: any) {
    let authData = req.user as DecodedIdToken;
    let profile: ProfileDTO = {
      profile: new Profile(
        authData.uid,
        authData.name,
        authData.email,
        authData.picture
      )
    };
    try {
      await this.profileService.create(profile);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getProfile(@Req() req: any) {
    try {
      let authData = req.user as DecodedIdToken;
      let profile: Profile = await this.profileService.getById(authData.uid);
      return profile;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() profileDTO: ProfileDTO) {
    try {
      let authData = req.user as DecodedIdToken;
      profileDTO.profile.uid = authData.uid;
      await this.profileService.update(profileDTO);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
