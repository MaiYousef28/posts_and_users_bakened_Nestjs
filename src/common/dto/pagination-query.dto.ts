import { Type } from "class-transformer";
import { IsInt, IsOptional, Min , Max} from "class-validator";


// /post?page=1&limit=10
export class PaginationQueryDto{
  
    @IsOptional()
    @Type(()=> Number)
    @IsInt({message :' page must be an intger'})
    @Min(1,{message :' page  must be at least 1'})
    page?:number =1


    @IsOptional()
    @Type(()=> Number)
    @IsInt({message :' Limit must be an intger'})
    @Min(1,{message :' Limit must be at least 1'})
    @Max(100,{message :`Limit can't exceed  100`})
    limit?:number =10
}