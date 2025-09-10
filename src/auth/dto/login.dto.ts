import { IsEmail, IsNotEmpty , IsString, MinLength , MaxLength} from "class-validator";



export class LoginDto{

    @IsEmail({}, {message:' please provide valid email'})
    email: string;


    @IsNotEmpty({message:' password is required! please provide me with password'})
    @MinLength(6,{message: "password must be at least 6 carachters"})
    password: string;
}