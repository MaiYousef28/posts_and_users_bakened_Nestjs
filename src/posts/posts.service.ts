import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entites/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/creat-post-dto';
import { UserDto } from '../auth/dto/user.dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { User, UserRole } from 'src/auth/entites/user-entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache } from 'cache-manager'
import { FindPostsQuery } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/pafinated-response.interface';

@Injectable()
export class PostsService {
private postListCashKeys :Set<string>= new Set();

    constructor(
    @InjectRepository(Post)
        private postsRpository :Repository<Post>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache

    ){}

    private generatePostListCacheKey(query:FindPostsQuery):string{
        const {page=1, limit= 10 , title} = query ;
        return ` posts_list_page${page}_limits${limit}_title${title || 'all'}`
    }

    async findAll(query:FindPostsQuery): Promise<PaginatedResponse<Post>> {

      const cacheKey = this.generatePostListCacheKey(query)
      this.postListCashKeys.add(cacheKey)
      const getCachedData = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey)
      if(getCachedData){
        console.log(`Chashed Hit ---> return posts ${cacheKey} `)
       return getCachedData  
       }
       console.log(`Chashed Missed ---> return posts from data base  `)

       const{page =1, limit =10,title} = query;
       const skip = (page -1)* limit
       const queryBuilder = this.postsRpository.createQueryBuilder('post').leftJoinAndSelect('post.authorName','authorName').orderBy('post.createdAt').skip(skip).take(limit)
       if(title){
        queryBuilder.andWhere('post.title ILIKE:title', {title:`%${title}%`})
       }

    const [items, totalItems] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(totalItems/limit)
      const responseData = {
        items,
        meta :{

    currentPage:page,
    itemsPerPage: limit ,
    totalItems,
    totalPages,
    hasPreviousPage: page>1,
    hasNextPage:page < totalPages,
        }
      }
   await this.cacheManager.set(cacheKey,responseData, 3000)
   return responseData
    }

    async findOne(id:number): Promise<Post>{
       const cacheKey = `post_${id}`
       const cachedPost = await this.cacheManager.get<Post>(cacheKey)
       if (cachedPost){
        console.log(`Chashed Hit ---> return posts ${cacheKey} `)
        return cachedPost

       }
       console.log(`Chashed Missed ---> return post from data base `)

       

        const singlePost =  await this.postsRpository.findOne({
            where:{id},
            relations:['authorName']
        })

        if(!singlePost){
            throw  new NotFoundException(` Post with the ID ${id} is not found`)
        }
        //storing
         await this.cacheManager.set(cacheKey, singlePost,30000)
        return singlePost;
    }

   async create(creatPostData: CreatePostDto, authorName: User): Promise<Post> {
        const newlyCreatedPost= this.postsRpository.create({
            title: creatPostData.title ,
            content: creatPostData.content,
            authorName
        }) 
            
        
        return this.postsRpository.save(newlyCreatedPost);
          
        };
    
      

   async update(id: number, updatePostData : UpdatePostDto, user:User) :Promise<Post>{

    const findPostToUpdate =await this.findOne(id)
    if(findPostToUpdate.authorName.id !==user.id && user.role !== UserRole.ADMIN){
        throw new ForbiddenException(' you can only update your post')
    }
    if(updatePostData.title){
      findPostToUpdate.title = updatePostData.title
    }
  
    if(updatePostData.content){
        findPostToUpdate.content = updatePostData.content
    }
        
      return this.postsRpository.save(findPostToUpdate);    }


    
    async Delete(id:number):Promise<void>{

        const findPostToDelete = await this.findOne(id)

      await this.postsRpository.remove(findPostToDelete)

    }


}
