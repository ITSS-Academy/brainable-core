import { HttpException,Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Storage} from "./entities/storage.entity";
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';


@Injectable()
export class StorageService {
  constructor(

  ) {
  }
    async uploadFilesToFirebase(files: Express.Multer.File[],folderName: string): Promise<string[]> {
        try{
            console.log("service", folderName);
            const bucketName =  "gs://social-network-29cc2.appspot.com";
            const urls = [];

            await Promise.all(
                files.map(async (file) => {
                        const fileName = `${folderName}/${uuidv4()}.data`;
                        console.log(fileName);
                        const fileUpload = admin.storage().bucket(bucketName).file(fileName);

                        const blobStream = fileUpload.createWriteStream({
                            metadata: {
                                contentType: file.mimetype
                            }
                        });

                        await new Promise((resolve, reject) => {
                            blobStream.on('error', (error) => {
                                reject(error);
                            });

                            blobStream.on('finish', async () => {
                                const [imageURL] = await fileUpload.getSignedUrl({
                                    action: 'read',
                                    expires: '12-01-2101',
                                });
                                urls.push(imageURL);
                                resolve(imageURL);
                            });

                            blobStream.end(file.buffer);
                        });
                    }
                ),
            );
            return urls;

        }catch (error){
            throw new HttpException(error.message, error.status);
        }


    }
}
