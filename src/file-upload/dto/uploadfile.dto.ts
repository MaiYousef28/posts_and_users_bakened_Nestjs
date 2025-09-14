import { IsOptional, MaxLength ,IsString} from "class-validator";



export class UploadFileDto{
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}