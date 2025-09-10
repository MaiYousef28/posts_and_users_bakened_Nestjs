import { IsEmail, IsNotEmpty , IsString, MinLength , MaxLength} from "class-validator";



export class RegisteerDto{

    @IsEmail({}, {message:' please provide valid email'})
    email: string;

    @IsNotEmpty({message:' Name is required! please provide me with name'})
    @IsString({message : "Name must be a sting"})
    @MinLength(3,{message: "Name must be at least 3 charachters"})
    @MaxLength(50,{ message: "Name must not exceed 50 charachters"})
    name: string;

    @IsNotEmpty({message:' password is required! please provide me with password'})
    @IsString({message : "password must be a sting"})
    @MinLength(6,{message: "password must be at least 6 charachters"})
    @MaxLength(50,{ message: "password must not exceed 50 charachters"})
    password: string;
}