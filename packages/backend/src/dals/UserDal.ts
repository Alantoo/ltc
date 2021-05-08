import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal } from './BaseDal';
import { User, UserDocument } from './schemas/User';

@Injectable()
export class UserDal extends BaseDal<UserDocument> {
  Model: Model<UserDocument>;

  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super({ Model: model });
    this.Model = model;
  }
}
