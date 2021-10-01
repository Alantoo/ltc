import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model, Types } from './BaseDal';
import {
  ItemSelect,
  ItemSelectDocument,
  RawItemSelectDocument,
} from './schemas/ItemSelect';

export {
  ItemSelect,
  ItemSelectDocument,
  RawItemSelectDocument,
  ItemSelectSchema,
  ItemSelectCreateDto,
} from './schemas/ItemSelect';

@Injectable()
export class ItemSelectDal extends BaseDal<ItemSelectDocument> {
  Model: Model<ItemSelectDocument>;

  constructor(@InjectModel(ItemSelect.name) model: Model<ItemSelectDocument>) {
    super({ Model: model });
    this.Model = model;
  }

  async getSelectedFor(parentId: any): Promise<Array<RawItemSelectDocument>> {
    const list = await this.Model.find({ parentId });
    return list.map((item) => item.toJSON());
  }

  async addSelectedFor(
    parentId: string,
    childId: string,
    index: number,
    options: {
      payType: string;
      payAddress: string;
      payAmount: number;
    },
  ): Promise<Array<RawItemSelectDocument>> {
    const { payType, payAddress, payAmount } = options;
    const item = new this.Model({
      parentId,
      childId,
      index,
      payType,
      payAddress,
      payAmount,
    });
    await item.save();
    return this.getSelectedFor(parentId);
  }

  async getByTrId(trId: string): Promise<RawItemSelectDocument> {
    const item = await this.Model.findOne({ payTx: trId });
    return item;
  }

  async deleteFor(itemId): Promise<void> {
    await this.Model.remove({ parentId: itemId });
    await this.Model.remove({ childId: itemId });
  }
}
