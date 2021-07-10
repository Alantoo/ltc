import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import {
  ItemSelectDal,
  ItemSelectDocument,
  RawItemSelectDocument,
} from '../dals/ItemSelectDal';

export {
  ItemSelect,
  ItemSelectDocument,
  RawItemSelectDocument,
} from '../dals/ItemSelectDal';

@Injectable()
export class ItemSelectService extends DalService<ItemSelectDocument> {
  private itemSelectDal: ItemSelectDal;

  constructor(@Inject(ItemSelectDal) itemSelectDal: ItemSelectDal) {
    super({ baseDal: itemSelectDal });
    this.itemSelectDal = itemSelectDal;
  }

  async getSelectedFor(
    parentId: string,
  ): Promise<Array<{ id: string; index: number }>> {
    const list = await this.itemSelectDal.getSelectedFor(parentId);
    return list.map((item: RawItemSelectDocument) => ({
      id: item.childId.toString(),
      index: item.index,
    }));
  }

  async addSelectedFor(
    parentId: string,
    childId: string,
    index: number,
  ): Promise<Array<{ id: string; index: number }>> {
    const list = await this.itemSelectDal.addSelectedFor(
      parentId,
      childId,
      index,
    );
    return list.map((item: RawItemSelectDocument) => ({
      id: item.childId.toString(),
      index: item.index,
    }));
  }

  async deleteFor(itemId: string): Promise<void> {
    await this.itemSelectDal.deleteFor(itemId);
  }
}
