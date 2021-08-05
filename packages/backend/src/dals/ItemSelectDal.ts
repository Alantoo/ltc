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
  ): Promise<Array<RawItemSelectDocument>> {
    const item = new this.Model({ parentId, childId, index });
    await item.save();
    return this.getSelectedFor(parentId);
  }

  async deleteFor(itemId): Promise<void> {
    await this.Model.remove({ parentId: itemId });
    await this.Model.remove({ childId: itemId });
  }
}