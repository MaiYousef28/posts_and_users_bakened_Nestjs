import { UserDto } from '../../auth/dto/user.dto';

export class PostDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorName: UserDto;
}