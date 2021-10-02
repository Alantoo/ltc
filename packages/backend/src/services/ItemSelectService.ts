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

export type ItemSelectSimple = {
  _id: string;
  id: string;
  index: number;
  isPaid?: boolean;
  payType?: string;
  payAddress?: string;
  payAmount?: number;
  payQrCode?: string;
  payTx?: string;
};

@Injectable()
export class ItemSelectService extends DalService<ItemSelectDocument> {
  private itemSelectDal: ItemSelectDal;

  constructor(@Inject(ItemSelectDal) itemSelectDal: ItemSelectDal) {
    super({ baseDal: itemSelectDal });
    this.itemSelectDal = itemSelectDal;
  }

  async getSelectedFor(parentId: string): Promise<Array<ItemSelectSimple>> {
    const list = await this.itemSelectDal.getSelectedFor(parentId);
    return list.map(this.normalizeToSimple);
  }

  async addSelectedFor(
    parentId: string,
    childId: string,
    index: number,
    options: {
      payType: string;
      payAddress: string;
      payAmount: number;
      payQrCode: string;
    },
  ): Promise<Array<ItemSelectSimple>> {
    const list = await this.itemSelectDal.addSelectedFor(
      parentId,
      childId,
      index,
      options,
    );
    return list.map(this.normalizeToSimple);
  }

  async getByTrId(trId: string): Promise<ItemSelectSimple> {
    const item = await this.itemSelectDal.getByTrId(trId);
    if (!item) {
      return;
    }
    return this.normalizeToSimple(item);
  }

  async deleteFor(itemId: string): Promise<void> {
    await this.itemSelectDal.deleteFor(itemId);
  }

  private normalizeToSimple(item: RawItemSelectDocument): ItemSelectSimple {
    return {
      _id: item.id.toString(),
      id: item.childId.toString(),
      index: item.index,
      isPaid: item.isPaid,
      payType: item.payType,
      payAddress: item.payAddress,
      payAmount: item.payAmount,
      payQrCode: item.payQrCode,
      payTx: item.payTx,
    };
  }
}
