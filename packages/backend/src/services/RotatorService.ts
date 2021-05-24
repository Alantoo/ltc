import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import { UserData } from './AuthService';
import {
  RotatorItemDal,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemCreateDto,
  rotateStatus,
} from '../dals/RotatorItemDal';

import { RawUserDocument } from '../dals/schemas/User';
import { filter } from 'rxjs/operators';

export {
  RawRotatorItemDocument,
  RotatorItemDocument,
  RotatorItem,
  RotatorItemCreateDto,
} from '../dals/RotatorItemDal';

export type ItemStatus = {
  item: RawRotatorItemDocument;
  list: Array<RawRotatorItemDocument>;
};

@Injectable()
export class RotatorService extends DalService<RotatorItemDocument> {
  rotatorItemDal: RotatorItemDal;

  constructor(@Inject(RotatorItemDal) rotatorItemDal: RotatorItemDal) {
    super({ baseDal: rotatorItemDal });
    this.rotatorItemDal = rotatorItemDal;
  }

  async create(
    data: RotatorItemCreateDto,
    user,
  ): Promise<RawRotatorItemDocument | undefined> {
    return super.create(
      {
        ...data,
        status: rotateStatus.SELECT,
      },
      user,
    );
  }

  async getHistory(user: UserData): Promise<Array<RawRotatorItemDocument>> {
    const list = await this.rotatorItemDal.getHistory(user.id);
    return list;
  }

  async getPending(user: UserData): Promise<RawRotatorItemDocument> {
    const item = await this.rotatorItemDal.getPending(user.id);
    return item;
  }

  async getStatus(id: string, user): Promise<ItemStatus> {
    let item = await this.rotatorItemDal.getOne(id);
    const list = await this.rotatorItemDal.getRandomFor(item.list, item.user);
    if (item.selected.length === list.length) {
      // done
      item = await this.rotatorItemDal.updateInternal(id, {
        status: rotateStatus.ADDED,
      });
    }
    return { item, list };
  }

  async selectUser(
    id: string,
    selectUserId: string,
    user,
  ): Promise<ItemStatus> {
    const curItem = await this.rotatorItemDal.getOne(id);
    let item = await this.rotatorItemDal.updateInternal(id, {
      selected: [...curItem.selected, selectUserId],
    });
    const list = await this.rotatorItemDal.getRandomFor(item.list, item.user);
    if (item.selected.length === list.length) {
      // done
      item = await this.rotatorItemDal.updateInternal(id, {
        status: rotateStatus.ADDED,
      });
    }
    return { item, list };
  }
}
