import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model, Types } from './BaseDal';
import {
  PaySelect,
  PaySelectDocument,
  RawPaySelectDocument,
} from './schemas/PaySelect';

export {
  PaySelect,
  PaySelectDocument,
  RawPaySelectDocument,
  PaySelectSchema,
  PaySelectCreateDto,
} from './schemas/PaySelect';

@Injectable()
export class PaySelectDal extends BaseDal<PaySelectDocument> {
  Model: Model<PaySelectDocument>;

  constructor(@InjectModel(PaySelect.name) model: Model<PaySelectDocument>) {
    super({ Model: model });
    this.Model = model;
  }

  async getCountForUser(userId: string): Promise<number> {
    const aggItem = await this.Model.aggregate([
      { $match: { userId: Types.ObjectId(userId) } },
      { $group: { _id: '$userId', amount: { $sum: '$amount' } } },
    ]);
    return aggItem[0] ? aggItem[0].amount : 0;
  }
}
