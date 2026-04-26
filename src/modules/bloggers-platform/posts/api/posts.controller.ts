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
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { CreatePostInputDto } from './input-dto/posts.input-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query-repository';
import { CommentsViewDto } from '../../comments/api/view-dto/comments.view-dto';
import { GetPostsQueryParams } from '../api/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PostsViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':id/comments')
  async getCommentsByPostId(
    @Query() query: GetCommentsQueryParams,
    @Param('id') postId: string,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    return this.commentsQueryRepository.getCommentsByPostId(query, postId);
  }

  @Post()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostsViewDto> {
    const postId = await this.postsService.createPost(body);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: CreatePostInputDto,
  ): Promise<void> {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
