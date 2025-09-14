import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entites/file.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entites/user-entity';
@Injectable()
export class FileUploadService {

    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRwpository: Repository<FileEntity>,
        private readonly cloudinaryService :CloudinaryService,
    ){}

 async uploadedfile(file :Express.Multer.File, description: string| undefined,user:User):Promise<FileEntity>{
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file) ;

    const newCreatedFile = await this.fileRwpository.create({
        originName:file.originalname,
        mimeType:file.mimetype,
        size:file.size,
        publicId: cloudinaryResponse?.public_id,
        url:cloudinaryResponse?.secure_url,
        description,
        uploader:user,
    });
    return this.fileRwpository.save(newCreatedFile)
 }

  async findAll():Promise< FileEntity[]>{
    return this.fileRwpository.find({
        relations:['uploader'],
        order:{createdAt:'DESC'}

    })
  }
 async remove(id:string):Promise<void>{
    const fileToBeDeleted =  await this.fileRwpository.findOne({
        where:{id}
    })
    if(!fileToBeDeleted){
        throw new NotFoundException(`file with ${id} is not exists`)
    }
    await this.cloudinaryService.deleteFile(fileToBeDeleted.publicId)
    await this.fileRwpository.remove(fileToBeDeleted)
 }
}
