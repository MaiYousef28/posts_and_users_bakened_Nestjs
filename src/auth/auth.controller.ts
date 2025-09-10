import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisteerDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './gaurds/jwt-auth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entites/user-entity';
import { RoleGuard } from './gaurds/roles-guards';
import { LoginThrottlerGuard } from './gaurds/login-throttler.guard';

@Controller('auth')
export class AuthController {

constructor( private authService :AuthService){}


@Post('register')
register(@Body()registerDto: RegisteerDto){
    return this.authService.register(registerDto)
}
@UseGuards(LoginThrottlerGuard)
@Post('login')
login(@Body()loginDto:LoginDto){
    return this.authService.login(loginDto)
}
@Post('refresh')
refreshToken(@Body('refreshToken')refreshToken: string){
    return this.authService.refershToken(refreshToken)
}


@UseGuards(JwtAuthGuard)
@Get('profile')
getProfilr(@CurrentUser() user:any){
    return user
}

@Post('create-admin')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard,RoleGuard)
createAdmin(@Body()registerDto: RegisteerDto){
    return this.authService.createAdmin(registerDto)
}

}
