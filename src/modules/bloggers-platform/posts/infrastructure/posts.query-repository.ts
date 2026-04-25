import { InjectModel } from '@nestjs/mongoose';
import { PostsViewDto } from '../api/view-dto/posts.view-dto';
import { Post, type PostModelType } from '../domain/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getAll(): Promise<PostsViewDto[]> {
    const result = await this.PostModel.find().exec();

    return result.map((post) => PostsViewDto.mapToView(post));
  }

  async getByIdOrNotFoundFail(id: string): Promise<PostsViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return PostsViewDto.mapToView(post);
  }
}
