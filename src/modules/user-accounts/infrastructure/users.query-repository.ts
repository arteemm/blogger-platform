import { InjectModel } from '@nestjs/mongoose';
import { UserViewDto } from '../api/view-dto/users.view-dto';
import { User, type UserModelType } from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

export class UsersQueryRepository {
    constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getAll(): Promise<UserViewDto[]> {
    const result = await this.UserModel.find().exec();
 
    return result.map((user) => UserViewDto.mapToView(user));
  }

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return UserViewDto.mapToView(user);
  }
}