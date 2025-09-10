import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule}from '@nestjs/typeorm'
import {Post}from './posts/entites/post.entity'
import {User}from './auth/entites/user-entity'
import{ThrottlerModule} from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),
    CacheModule.register({
      isGlobal:true,
      ttl:3000,
      max:100
    })
    
    ,
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'postgres',
      database:"RestAPI-nest-project",
      entities:[Post, User],
      synchronize :true, // for development part to create the schema

    })
    ,
    PostsModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
