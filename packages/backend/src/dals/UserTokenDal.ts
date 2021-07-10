import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, FilterQuery } from './BaseDal';
import {
  UserToken,
  UserTokenDocument,
  RawUserTokenDocument,
  UserTokenCreateDto,
} from './schemas/UserToken';

export {
  UserToken,
  UserTokenDocument,
  RawUserTokenDocument,
  UserTokenSchema,
  UserTokenCreateDto,
} from './schemas/UserToken';

@Injectable()
export class UserTokenDal {
  Model: Model<UserTokenDocument>;

  constructor(@InjectModel(UserToken.name) model: Model<UserTokenDocument>) {
    this.Model = model;
  }

  async getOne(id: string): Promise<RawUserTokenDocument | undefined> {
    const query: FilterQuery<Document> = { _id: id };
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async getOneByUserId(
    userId: string,
  ): Promise<RawUserTokenDocument | undefined> {
    const query: FilterQuery<Document> = { userId };
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async create(
    data: UserTokenCreateDto,
  ): Promise<RawUserTokenDocument | undefined> {
    const doc = new this.Model(data);
    await doc.save();
    if (doc) {
      return doc.toJSON();
    }
  }

  async delete(id: string): Promise<RawUserTokenDocument> {
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
