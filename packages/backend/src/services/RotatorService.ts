import * as nodeCron from 'node-cron';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DalService, ListQuery, ListResult } from './DalService';
import { UserData } from './AuthService';
import { UserService } from './UserService';
import { ListService, ListConfig } from './ListService';
import { ItemSelectService, ItemSelectSimple } from './ItemSelectService';
import { PaySelectService } from './PaySelectService';
import { PaymentService, TransactionInfo } from './PaymentService';

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
  paySelectService: PaySelectService;
  paymentService: PaymentService;

  constructor(
    @Inject(RotatorItemDal) rotatorItemDal: RotatorItemDal,
    @Inject(UserService) userService: UserService,
    @Inject(ListService) listService: ListService,
    @Inject(ItemSelectService) selectService: ItemSelectService,
    @Inject(PaySelectService) paySelectService: PaySelectService,
    @Inject(PaymentService) paymentService: PaymentService,
  ) {
    super({ baseDal: rotatorItemDal });
    this.rotatorItemDal = rotatorItemDal;
    this.userService = userService;
    this.listService = listService;
    this.selectService = selectService;
    this.paySelectService = paySelectService;
    this.paymentService = paymentService;

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
      const info = await this.paymentService.chargeGetInfo(paymentCode);
      await this.rotatorItemDal.updateInternal(item.id, {
        status: rotateStatus.SELECT,
        payType: info.currency,
        payAddress: info.from,
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
    if (this.isAllPayed(selected, list)) {
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
    const selectedItem = await this.getOne(selectedItemId, {});
    if (!selectedItem) {
      throw new NotFoundException();
    }
    const rotatorList = await this.listService.getListConfig(item.list);
    const selected = await this.addSelectedItem(
      item,
      selectedItem,
      index,
      rotatorList,
    );
    const list = await this.getRandomFor(item, selected, rotatorList);
    if (this.isAllPayed(selected, list)) {
      // done
      item = await this.addToRotation(id, rotatorList.rotateTimeMs);
    }
    return { item, list };
  }

  async selectConfirm(
    id: string,
    selectedItemId: string,
    trId: string,
    user: UserData,
  ): Promise<ItemStatus> {
    const item = await this.getOne(id, user);
    if (!item) {
      throw new NotFoundException();
    }
    const selectedItem = await this.getOne(selectedItemId, {});
    if (!selectedItem) {
      throw new NotFoundException();
    }
    let trInfo: TransactionInfo;
    try {
      const currency = selectedItem.payType;
      trInfo = await this.paymentService.getTxInfo(currency, trId);
    } catch (err) {
      throw new NotFoundException('Can not get transaction info');
    }

    if (!trInfo) {
      throw new NotFoundException('Can not get transaction info');
    }

    if (!trInfo.success) {
      throw new NotFoundException('Transaction not approved yet');
    }

    const selected = await this.selectService.getSelectedFor(item.id);
    const selectedDetail = selected.find((i) => i.id === selectedItemId);

    // TODO remove before production
    // if (!selectedDetail || trInfo.value !== selectedDetail.payAmount) {
    //   throw new NotFoundException('Transaction not correct amount');
    // }
    //
    // if (!selectedDetail || trInfo.to !== selectedDetail.payAddress) {
    //   throw new NotFoundException('Transaction not correct address');
    // }

    const already = await this.selectService.getByTrId(trId);
    if (already) {
      throw new NotFoundException('Transaction already exist');
    } else {
      await this.selectService.updateInternal(selectedDetail._id, {
        isPaid: true,
        payTx: trId,
      });
    }

    return this.getStatus(id, user);
  }

  private async addSelectedItem(
    item: RawRotatorItemDocument,
    selectedItem: RawRotatorItemDocument,
    selectIndex: number,
    rotatorList: ListConfig,
  ): Promise<Array<ItemSelectSimple>> {
    const amount = await this.paymentService.getCoinsAmount(
      item.payType,
      rotatorList.price,
    );
    const selected = await this.selectService.addSelectedFor(
      item.id,
      selectedItem.id,
      selectIndex,
      {
        payType: item.payType,
        payAddress: item.payAddress,
        payAmount: amount,
      },
    );
    // add selected
    // await this.paySelectService.addSelectPay({
    //   userId: selectedItem.user,
    //   fromUserId: item.user,
    //   listId: rotatorList.id,
    //   amount: rotatorList.price,
    // });
    // await this.userService.incrementBalance(
    //   selectedItem.user.toString(),
    //   rotatorList.price,
    // );
    return selected;
  }

  private isAllPayed(
    selected: Array<ItemSelectSimple>,
    list: Array<RawRotatorItemDocumentForUi>,
  ): boolean {
    const isAllSelected = selected.length === list.length;
    const notPayed = selected.find((item) => !item.isPaid);
    return isAllSelected && !notPayed;
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
    selected: Array<ItemSelectSimple>,
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
