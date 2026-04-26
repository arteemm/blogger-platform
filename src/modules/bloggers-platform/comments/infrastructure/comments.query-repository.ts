import { InjectModel } from '@nestjs/mongoose';
import { CommentsViewDto } from '../api/view-dto/comments.view-dto';
import { Comment, type CommentModelType } from '../domain/comment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { QueryFilter } from 'mongoose';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  async getAll(): Promise<CommentsViewDto[]> {
    const result = await this.CommentModel.find().exec();

    return result.map((comment) => CommentsViewDto.mapToView(comment));
  }

  async getByIdOrNotFoundFail(id: string): Promise<CommentsViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return CommentsViewDto.mapToView(comment);
  }

  async getCommentsByPostId(
    query: GetCommentsQueryParams,
    postId: string,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    const filter: QueryFilter<Comment> = {
      postId: postId,
      deletedAt: null,
    };

    const posts = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.CommentModel.countDocuments(filter);

    const items = posts.map(CommentsViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
