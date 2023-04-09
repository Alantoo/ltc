import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, FilterQuery } from './BaseDal';
import {
  UserResetPasswordToken,
  UserResetPasswordTokenDocument,
  RawUserResetPasswordTokenDocument,
  UserResetPasswordTokenCreateDto,
} from './schemas/UserResetPasswordToken';

export {
  UserResetPasswordToken,
  UserResetPasswordTokenDocument,
  RawUserResetPasswordTokenDocument,
  UserResetPasswordTokenCreateDto,
  UserResetPasswordTokenSchema,
} from './schemas/UserResetPasswordToken';

@Injectable()
export class UserResetPasswordTokenDal {
  Model: Model<UserResetPasswordTokenDocument>;

  constructor(
    @InjectModel(UserResetPasswordToken.name)
    model: Model<UserResetPasswordTokenDocument>,
  ) {
    this.Model = model;
  }

  async getOne(
    id: string,
  ): Promise<RawUserResetPasswordTokenDocument | undefined> {
    const query: FilterQuery<Document> = { _id: id };
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async getOneByUserId(
    userId: string,
  ): Promise<RawUserResetPasswordTokenDocument | undefined> {
    const query: FilterQuery<Document> = { userId };
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async create(
    data: UserResetPasswordTokenCreateDto,
  ): Promise<RawUserResetPasswordTokenDocument | undefined> {
    const doc = new this.Model(data);
    await doc.save();
    if (doc) {
      return doc.toJSON();
    }
  }

  async delete(id: string): Promise<RawUserResetPasswordTokenDocument> {
    const query: FilterQuery<Document> = { _id: id };
    const doc = await this.Model.findOne(query);
    let obj;
    if (doc) {
      obj = doc.toJSON();
      await doc.delete();
    }
    return obj;
  }
}
