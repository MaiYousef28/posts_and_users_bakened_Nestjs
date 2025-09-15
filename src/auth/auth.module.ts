import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entites/user-entity'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule}from '@nestjs/passport'
import { JwtStrategy } from './stratgeies/jwt.strategy';
import { RoleGuard } from './gaurds/roles-guards';
import { EventsModule } from 'src/events/events.module';


@Module({
    imports: [
      // User entity is available in this scope of module 
      TypeOrmModule.forFeature([User]),
      PassportModule
      ,
      JwtModule.register({
      //secret: 'your-secret-key', // 🔐 use process.env.JWT_SECRET in real apps
      signOptions: { expiresIn: '1h' }
    }),
    EventsModule ,
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,RoleGuard],
  exports:[AuthService, RoleGuard]
})
export class AuthModule {}
