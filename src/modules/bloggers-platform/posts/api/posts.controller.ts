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

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAll(@Query() query: any): Promise<PostsViewDto[]> {
    return this.postsQueryRepository.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PostsViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
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
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
