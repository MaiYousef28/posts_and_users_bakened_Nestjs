import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entites/user-entity';
import { Repository } from 'typeorm';
import { RegisteerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEventsService } from 'src/events/user-event.service';

@Injectable()
export class AuthService {

constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService ,
    private readonly userEventsService: UserEventsService
){
        bcrypt.hash("123456",10).then(console.log)

}


async register(registerDto :RegisteerDto){

    const existungUser = await this.usersRepository.findOne({
        where:{email: registerDto.email}
    })
    if(existungUser){
        throw new ConflictException(' Email already in use ! please try to use different email')
    }
    const hashedPassword = await this.hashedPassword(registerDto.password)
    const newlyCreatUser ={
        email: registerDto.email ,
        name: registerDto.name,
        password:hashedPassword ,
        role: UserRole.USER
    }

    const savedUser = await this.usersRepository.save(newlyCreatUser);
    // emit event 
    this.userEventsService.emitUserRegisterd(savedUser)
    const { password , ...result} = savedUser;
    return{
        user : result,
        message : ' registeration successfuly! Please login to continueo'
    } 
}


// function for create admin user 
async createAdmin(registerDto :RegisteerDto){
    
    const existungUser = await this.usersRepository.findOne({
        where:{email: registerDto.email}
    })
    if(existungUser){
        throw new ConflictException(' Email already in use ! please try to use different email')
    }
    const hashedPassword = await this.hashedPassword(registerDto.password)
    const newlyCreatUser ={
        email: registerDto.email ,
        name: registerDto.name,
        password:hashedPassword ,
        role: UserRole.ADMIN
    }

    const savedUser = await this.usersRepository.save(newlyCreatUser);

    const { password , ...result} = savedUser;
    return{
        user : result,
        message : ' admin user has created Sucessfuly'
    } 
}

async login(loginDto: LoginDto){
    const user = await this.usersRepository.findOne({
        where: {email:loginDto.email}
    })
    if(!user || !(await this.verifyPassword(loginDto.password , user.password))){
      throw new UnauthorizedException(' Invalid credintial or account not exist ')
    }
    // generate the token if the user exist 
    const tokens = await this.generateTokens(user)
    const { password, ...result} = user ;
    return {
        user: result,
       ...tokens
    }
}

async refershToken(refreshToken:string){
    try{
        const payload = this.jwtService.verify(refreshToken,{
            secret:'refresh-secret'
        })
        const user = await this.usersRepository.findOne({
            where:{id:payload.sub}
        })
        if(!user){
        throw new UnauthorizedException('Invalid Token')
        }
        const acccessToken = this.generateAccessToken(user)
        return {acccessToken};

    }catch(e){
        throw new UnauthorizedException('Invalid Token')

    }
}

/// to find the current user By Id will do later 

async getUserById(userId:number){
    const user = await this.usersRepository.findOne({
        where:{id: userId}
    })
  
    if(!user){
      throw new UnauthorizedException('User not found!')
    }   
    const{ password , ...result}= user;
    return result;
    
}

//// helper functions *
private async hashedPassword(password: string):Promise<string>{

    return bcrypt.hash(password,10)
}

private async verifyPassword(plainPassword:string , hashedPassword:string) :Promise<boolean>{
    return bcrypt.compare(plainPassword,hashedPassword)
}

private async generateTokens(user: User){
return{
    acccessToken:this.generateAccessToken(user) ,
    refreshToken:this.generateRefreshToken(user)
}
}

private generateAccessToken(user:User): string{
    /// what I want on my payload -> email , id , rlole -> help us to build role acess control -> user ? admin ?
    const payload = {
        email: user.email,
        sub:user.id,
        role:user.role
    }
    return this.jwtService.sign(payload,{
        secret: 'jwt-secret',


    })
}
private generateRefreshToken(user:User){
   const payload = {
        sub:user.id,
    }
    return this.jwtService.sign(payload,{
        secret: 'refresh-secret',
    });
}
}
