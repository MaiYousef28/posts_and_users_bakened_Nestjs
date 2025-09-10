import { Body, Controller , Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity} from "./entites/post.entity"
import { CreatePostDto } from './dto/creat-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entites/user-entity';
import { RoleGuard } from 'src/auth/gaurds/roles-guards';
import { FindPostsQuery } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/pafinated-response.interface';
@Controller('posts')
export class PostsController {


    constructor( private readonly postsService :PostsService){}

   @Get()
   async findAll(@Query() query: FindPostsQuery)
   :Promise<PaginatedResponse<PostEntity>>{
    return this.postsService.findAll(query)
   }



    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id:number):Promise<PostEntity>  {
        return this.postsService.findOne(id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
      async create(
        @Body() createPostData: CreatePostDto,@CurrentUser()user:any
       ):Promise<PostEntity>{
      return  this.postsService.create(createPostData,user)
    }

     @UseGuards(JwtAuthGuard)
    @Put(":id")
    update( @Param('id', ParseIntPipe)id : number , 
        @Body() updatePostData: UpdatePostDto, @CurrentUser()user:any):Promise<PostEntity>{
        return this.postsService.update(id,updatePostData, user);
}

     @Roles(UserRole.ADMIN)
     @UseGuards(JwtAuthGuard,RoleGuard)
     @Delete(":id")
     @HttpCode(HttpStatus.NO_CONTENT)
   async delete(@Param('id', ParseIntPipe)id :number): Promise<void >{
    this.postsService.Delete(id);
   }
}
