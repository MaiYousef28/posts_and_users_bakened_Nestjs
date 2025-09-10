import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";




export class CreatePostDto{

    @IsNotEmpty({message:'Title is required'})
    @IsString({message : "Title must be a sting"})
    @MinLength(3,{message: "title must be at least 3 charachters"})
    @MaxLength(50,{ message: "title must not exceed 50 charachters"})
    title :string;

    @IsNotEmpty({message:'content is required'})
    @IsString({message : "content must be a sting"})
    @MinLength(5,{message: "content must be at least 5 charachters"})
    content: string;

 

 

}