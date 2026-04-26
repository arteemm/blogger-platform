import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './input-dto/blogs.input-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { PostsService } from '../../posts/application/posts.service';
import { PostsViewDto } from '../../posts/api/view-dto/posts.view-dto';
import { CreatePostInputDto } from '../../posts/api/input-dto/posts.input-dto';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BlogsViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':id/posts')
  async getPostsByBlogId(
    @Query() query: GetPostsQueryParams,
    @Param('id') blogId: string,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postsQueryRepository.getPostsByBlogId(query, blogId);
  }

  @Post()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogsViewDto> {
    const blogId = await this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Post(':id/posts')
  async createPostsByBlogId(
    @Param('id') blogId: string,
    @Body() body: Omit<CreatePostInputDto, 'blogId'>,
  ): Promise<PostsViewDto> {
    const postId = await this.postsService.createPost({
      ...body,
      blogId: blogId,
    });

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() body: CreateBlogInputDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }
}
