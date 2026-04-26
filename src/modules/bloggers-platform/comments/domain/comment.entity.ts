import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDomainDto } from './dto/create-comment.domain.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from './commentatorInfo.schema';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: CommentatorInfoSchema })
  commentatorInfo!: CommentatorInfo;

  @Prop({ type: String, required: true })
  postId!: string;

  createdAt!: Date;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt!: Date | null;

  static createInstance(dto: CreateCommentDomainDto): CommentDocument {
    const comment = new this();
    comment.content = dto.content;
    comment.commentatorInfo.userId = dto.userId;
    comment.commentatorInfo.userLogin = dto.userLogin;
    comment.postId = dto.postId;

    return comment as CommentDocument;
  }

  update(dto: UpdateCommentDto) {
    this.content = dto.content;
  }

  makeDeleted() {
    console.log(this.deletedAt);
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

//регистрирует методы сущности в схеме
CommentSchema.loadClass(Comment);

//Типизация документа
export type CommentDocument = HydratedDocument<Comment>;

//Типизация модели + статические методы
export type CommentModelType = Model<CommentDocument> & typeof Comment;
