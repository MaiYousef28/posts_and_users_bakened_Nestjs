import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";



export class FindPostsQuery extends PaginationQueryDto{
    @IsOptional()
    @IsString({message:'title must be a string'})
    @MaxLength(100, {message :`Title search can't exceed 100 charachters`})
    title?: string;
}