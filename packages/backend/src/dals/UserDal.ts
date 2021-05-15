import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model } from './BaseDal';
import {
  User,
  UserDocument,
  RawUserDocument,
  UserSchema,
} from './schemas/User';

export {
  User,
  UserDocument,
  RawUserDocument,
  UserSchema,
} from './schemas/User';

@Injectable()
export class UserDal extends BaseDal<UserDocument> {
  Model: Model<UserDocument>;

  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super({ Model: model });
    this.Model = model;
  }

  async findByEmail(email: string): Promise<RawUserDocument | undefined> {
    const doc = await this.Model.findOne({ email });
    if (doc) {
      const obj = doc.toJSON();
      obj.password = doc.password;
      return obj;
    }
  }
}