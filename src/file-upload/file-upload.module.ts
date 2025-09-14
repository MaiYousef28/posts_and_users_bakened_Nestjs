import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entites/file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports:[ CloudinaryModule ,TypeOrmModule.forFeature([FileEntity]) , MulterModule.register({
    storage:memoryStorage()
  })],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule {}
