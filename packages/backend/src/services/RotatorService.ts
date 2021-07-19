import * as nodeCron from 'node-cron';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DalService, ListQuery, ListResult } from './DalService';
import { UserData } from './AuthService';
import { UserService } from './UserService';
import { ListService, ListConfig } from './ListService';
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

const dateToCron = (date: Date): string => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

@Injectable()
export class RotatorService extends DalService<RotatorItemDocument> {
  protected readonly logger = new Logger(RotatorService.name);

  rotatorItemDal: RotatorItemDal;
  listService: ListService;
  userService: UserService;
  selectService: ItemSelectService;

  constructor(
    @Inject(RotatorItemDal) rotatorItemDal: RotatorItemDal,
    @Inject(UserService) userService: UserService,
    @Inject(ListService) listService: ListService,
    @Inject(ItemSelectService) selectService: ItemSelectService,
  ) {
    super({ baseDal: rotatorItemDal });
    this.rotatorItemDal = rotatorItemDal;
    this.userService = userService;
    this.listService = listService;
    this.selectService = selectService;

    setTimeout(() => {
      this.checkRotatorExpire().catch((err) => {
        this.logger.error(err);
      });
    }, 1000 * 30);
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
    const rotatorList = await this.listService.getListConfig(item.list);
    const selected = await this.selectService.getSelectedFor(item.id);
    const list = await this.getRandomFor(item, selected, rotatorList);
    if (selected.length === list.length) {
      // done
      item = await this.addToRotation(id, rotatorList.rotateTimeMs);
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
    const rotatorList = await this.listService.getListConfig(item.list);
    const selected = await this.selectService.addSelectedFor(
      id,
      selectedItemId,
      index,
    );
    const list = await this.getRandomFor(item, selected, rotatorList);
    if (selected.length === list.length) {
      // done
      item = await this.addToRotation(id, rotatorList.rotateTimeMs);
    }
    return { item, list };
  }

  private async checkRotatorExpire() {
    return this.rotatorItemDal.getActiveAsync((item) => {
      if (!item.removeAt) {
        return;
      }
      const diff = item.removeAt.getTime() - Date.now();
      const itemId = item.id;
      if (diff <= 0) {
        this.removeFromRotation(itemId);
      } else {
        nodeCron.schedule(dateToCron(item.removeAt), () => {
          this.removeFromRotation(itemId);
        });
      }
    });
  }

  private async addToRotation(
    id: string,
    rotateTimeMs: number,
  ): Promise<RawRotatorItemDocument> {
    const removeAt = new Date(Date.now() + rotateTimeMs);
    const item = await this.rotatorItemDal.updateInternal(id, {
      status: rotateStatus.ADDED,
      removeAt,
    });
    this.logger.log(`Item "${item.id}" added to rotation`);
    const itemId = item.id;
    nodeCron.schedule(dateToCron(removeAt), () => {
      this.removeFromRotation(itemId);
    });
    return item;
  }

  private async removeFromRotation(
    id: string,
  ): Promise<RawRotatorItemDocument> {
    const item = await this.rotatorItemDal.updateInternal(id, {
      status: rotateStatus.REMOVED,
    });
    this.logger.log(`Item "${item.id}" removed from rotation`);
    return item;
  }

  private async getRandomFor(
    item: RawRotatorItemDocument,
    selected: Array<{ id: string; index: number }>,
    rotatorList: ListConfig,
  ): Promise<Array<RawRotatorItemDocumentForUi>> {
    const userInfo = await this.userService.getOne(item.user, {});
    let referUser;
    try {
      referUser = await this.userService.getOne(userInfo.refer, {});
    } catch (err) {}
    const list = await this.rotatorItemDal.getRandomFor(
      item.list,
      item.user,
      selected,
      rotatorList.selectCount,
      referUser ? referUser.id : undefined,
    );
    return list;
  }

  async _afterDelete(obj, user) {
    await this.selectService.deleteFor(obj.id);
    return super._afterDelete(obj, user);
  }
}
