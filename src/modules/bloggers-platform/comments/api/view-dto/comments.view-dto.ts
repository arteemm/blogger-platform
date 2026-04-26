import { CommentDocument } from '../../domain/comment.entity';

export class CommentsViewDto {
  id!: string;
  content!: string;
  commentatorInfo!: {
    userId: string;
    userLogin: string;
  };
  createdAt!: Date;
  likesInfo!: {
    likesCount: 0;
    dislikesCount: 0;
    myStatus: 'None';
  };

  static mapToView(blog: CommentDocument): CommentsViewDto {
    const dto = new CommentsViewDto();

    dto.id = blog._id.toString();
    dto.content = blog.content;
    dto.commentatorInfo.userId = blog.commentatorInfo.userId;
    dto.commentatorInfo.userLogin = blog.commentatorInfo.userLogin;
    dto.createdAt = blog.createdAt;

    return dto;
  }
}
