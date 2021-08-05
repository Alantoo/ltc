import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model, Types } from './BaseDal';
import { PayOut, PayOutDocument, RawPayOutDocument } from './schemas/PayOut';

export {
  PayOut,
  PayOutDocument,
  RawPayOutDocument,
  PayOutSchema,
  PayOutCreateDto,
} from './schemas/PayOut';

@Injectable()
export class PayOutDal extends BaseDal<PayOutDocument> {
  Model: Model<PayOutDocument>;

  constructor(@InjectModel(PayOut.name) model: Model<PayOutDocument>) {
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
