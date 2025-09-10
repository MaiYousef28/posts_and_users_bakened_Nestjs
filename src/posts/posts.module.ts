import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post}from './entites/post.entity'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    // post entity is available in this scope of module 
    TypeOrmModule.forFeature([Post]),
    AuthModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
