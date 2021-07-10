import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DalService, ListQuery, ListResult } from './DalService';
import { UserData } from './AuthService';
import { ItemSelectService } from './ItemSelectService';
import {
  RotatorItemDal,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RawRotatorItemDocumentForUi,
  RotatorItemCreateDto,
  rotateStatus,
} from '../dals/RotatorItemDal';

export {
  RawRotatorItemDocument,
  RawRotatorItemDocumentForUi,
  RotatorItemDocument,
  RotatorItem,
  RotatorItemCreateDto,
  rotateStatus,
} from '../dals/RotatorItemDal';

export type ItemStatus = {
  item: RawRotatorItemDocument;
  list: Array<RawRotatorItemDocumentForUi>;
};

const SELECT_COUNT = 6;

@Injectable()
export class RotatorService extends DalService<RotatorItemDocument> {
  rotatorItemDal: RotatorItemDal;
  selectService: ItemSelectService;

  constructor(
    @Inject(RotatorItemDal) rotatorItemDal: RotatorItemDal,
    @Inject(ItemSelectService) selectService: ItemSelectService,
  ) {
    super({ baseDal: rotatorItemDal });
    this.rotatorItemDal = rotatorItemDal;
    this.selectService = selectService;
  }

  async getComplexList(
    query?: ListQuery,
    user?: UserData,
  ): Promise<ListResult<RotatorItemDocument>> {
    const { filter, range, sort } = query || {};
    await this._beforeListFilter(filter, user);
    await this._beforeListRange(range, user);
    await this._beforeListSort(sort, user);
    const [data, total] = await Promise.all([
      this.rotatorItemDal.getComplexList({ filter, range, sort }),
      this.rotatorItemDal.getComplexCount({ filter, range, sort }),
    ]);
    return { data, total };
  }

  async create(
    data: RotatorItemCreateDto,
    user: UserData,
  ): Promise<RawRotatorItemDocument | undefined> {
    return super.create(data, user);
  }

  async updateStatus(paymentCode: string, payStatus: string): Promise<void> {
    const item = await this.rotatorItemDal.getOneByCode(paymentCode);

    if (!item) {
      return;
    }

    if (payStatus === 'charge:failed') {
      await this.rotatorItemDal.updateInternal(item.id, {
        status: rotateStatus.REMOVED,
      });
    }

    if (payStatus === 'charge:pending') {
      await this.rotatorItemDal.updateInternal(item.id, {
        status: rotateStatus.PENDING,
      });
    }

    if (
      payStatus === 'charge:confirmed' ||
      payStatus === 'charge:delayed' ||
      payStatus === 'charge:resolved'
    ) {
      await this.rotatorItemDal.updateInternal(item.id, {
        status: rotateStatus.SELECT,
      });
    }
  }

  async getHistory(user: UserData): Promise<Array<RawRotatorItemDocument>> {
    const list = await this.rotatorItemDal.getHistory(user.id);
    return list;
  }

  async getPending(user: UserData): Promise<RawRotatorItemDocument> {
    const item = await this.rotatorItemDal.getPending(user.id);
    return item;
  }

  async getStatus(id: string, user: UserData): Promise<ItemStatus> {
    let item = await this.getOne(id, user);
    if (!item) {
      throw new NotFoundException();
    }
    const selected = await this.selectService.getSelectedFor(item.id);
    const list = await this.rotatorItemDal.getRandomFor(
      item.list,
      item.user,
      selected,
      SELECT_COUNT,
    );
    if (selected.length === list.length) {
      // done
      item = await this.rotatorItemDal.updateInternal(id, {
        status: rotateStatus.ADDED,
      });
    }
    return { item, list };
  }

  async selectUser(
    id: string,
    selectedItemId: string,
    index: number,
    user: UserData,
  ): Promise<ItemStatus> {
    let item = await this.getOne(id, user);
    if (!item) {
      throw new NotFoundException();
    }
    const selected = await this.selectService.addSelectedFor(
      id,
      selectedItemId,
      index,
    );
    const list = await this.rotatorItemDal.getRandomFor(
      item.list,
      item.user,
      selected,
      SELECT_COUNT,
    );
    if (selected.length === list.length) {
      // done
      item = await this.rotatorItemDal.updateInternal(id, {
        status: rotateStatus.ADDED,
      });
    }
    return { item, list };
  }

  async _afterDelete(obj, user) {
    await this.selectService.deleteFor(obj.id);
    return super._afterDelete(obj, user);
  }
}
