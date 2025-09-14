import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/uploadfile.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User, UserRole } from 'src/auth/entites/user-entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/gaurds/roles-guards';

@Controller('file-upload')
export class FileUploadController {

constructor(
    private readonly fileUploadService: FileUploadService
){}

@Post()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
async uploadFile(
    @UploadedFile()file :Express.Multer.File,
    @Body() uploadFileDto :UploadFileDto,
    @CurrentUser() user:User
): Promise<any>{
    if(!file){
        throw new BadRequestException('File is required')
    }
    return this.fileUploadService.uploadedfile(file,uploadFileDto.description,user)
}
@Get()
async findAll(){
    return this.fileUploadService.findAll()
}

@Delete(':id')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
async remove(@Param('id', ParseUUIDPipe) id:string){
    await this.fileUploadService.remove(id);
    return {
        message: 'file delere successfully',
    };
}
}
// hello tea