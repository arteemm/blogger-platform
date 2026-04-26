import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    try {
      const blog = await this.blogsQueryRepository.getByIdOrNotFoundFail(
        dto.blogId,
      );

      const post = this.PostModel.createInstance({
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId,
        blogName: blog.name,
      });
      await this.postsRepository.save(post);

      return post._id.toString();
    } catch (e: unknown) {
      throw new HttpException(
        {
          errorsMessages: [{ message: 'blog is not find', field: 'blogId' }],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updatePost(id: string, dto: UpdatePostDto) {
    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.update(dto);

    await this.postsRepository.save(post);
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }
}
