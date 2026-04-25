import { InjectModel } from '@nestjs/mongoose';
import { BlogsViewDto } from '../api/view-dto/blogs.view-dto';
import { Blog, type BlogModelType } from '../domain/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async getAll(): Promise<BlogsViewDto[]> {
    const result = await this.BlogModel.find().exec();

    return result.map((blog) => BlogsViewDto.mapToView(blog));
  }

  async getByIdOrNotFoundFail(id: string): Promise<BlogsViewDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return BlogsViewDto.mapToView(blog);
  }
}
