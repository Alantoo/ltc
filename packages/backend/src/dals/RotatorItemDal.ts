import { Document, FilterQuery, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, ListQuery, Model } from './BaseDal';
import { ItemSelectSimple } from '../services/ItemSelectService';
import { RawUserDocument } from '../services/UserService';
import {
  RawRotatorItemDocument,
  RotatorItem,
  RotatorItemDocument,
} from './schemas/RotatorItem';

export type RawRotatorItemDocumentForUi = RawRotatorItemDocument & {
  isSelected: boolean;
  isPaid?: boolean;
  payType?: string;
  payAddress?: string;
  payAmount?: number;
  payTx?: string;
  payQrCode?: string;
};

export {
  RotatorItem,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemSchema,
  RotatorItemCreateDto,
} from './schemas/RotatorItem';

export const rotateStatus = {
  NONE: 'none',
  PAY: 'pay',
  PENDING: 'pending',
  SELECT: 'select',
  ADDED: 'added',
  REMOVED: 'removed',
  REFER: 'refer',
};

const random = (max) => {
  return Math.floor(Math.random() * (max + 1));
};
const shuffle = (a) => {
  const length = a.length,
    shuffled = Array(length);
  for (let index = 0, rand; index < length; ++index) {
    rand = random(index);
    if (rand !== index) shuffled[index] = shuffled[rand];
    shuffled[rand] = a[index];
  }
  return shuffled;
};

const range = (length) => {
  return Array(length)
    .fill(null)
    .map(function (cv, i) {
      return i;
    });
};
const sample = (a, n) => {
  return shuffle(a).slice(0, Math.max(0, n));
};

@Injectable()
export class RotatorItemDal extends BaseDal<RotatorItemDocument> {
  Model: Model<RotatorItemDocument>;

  constructor(
    @InjectModel(RotatorItem.name) model: Model<RotatorItemDocument>,
  ) {
    super({ Model: model });
    this.Model = model;
  }

  async getComplexCount(query: ListQuery): Promise<number> {
    const aggs = this.getComplexListAggregation(query, true);
    const list = await this.Model.aggregate(aggs);
    return list[0] ? list[0].count : 0;
  }

  async getComplexList(
    query: ListQuery,
  ): Promise<Array<RawRotatorItemDocument>> {
    const aggs = this.getComplexListAggregation(query);
    const list = await this.Model.aggregate(aggs);
    return list;
  }

  private getComplexListAggregation(
    query: ListQuery,
    isCount = false,
  ): Array<any> {
    const { filter, range, sort } = query;
    let skip = 0;
    let limit = undefined;
    if (range) {
      skip = range[0];
      limit = range[1] - range[0] + 1;
    }
    let sortRule = undefined;
    if (sort) {
      sortRule = { [sort[0]]: sort[1].toLowerCase() === 'asc' ? 1 : -1 };
    }
    const { query: queryStr = '', ...restFilters } = filter;
    const filterRule = {
      ...restFilters,
      $and: [
        {
          $or: [
            {
              'user.name': { $regex: queryStr },
            },
            {
              'user.email': { $regex: queryStr },
            },
          ],
        },
      ],
    };
    const aggs: Array<any> = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'lists',
          localField: 'list',
          foreignField: '_id',
          as: 'list',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$list', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: '$_id',
          status: 1,
          createdAt: 1,
          user: {
            _id: undefined,
            id: '$user._id',
            name: 1,
            email: 1,
          },
          list: {
            _id: undefined,
            id: '$list._id',
            name: 1,
            price: 1,
          },
        },
      },
      { $match: filterRule },
    ];
    if (isCount) {
      aggs.push({ $count: 'count' });
    } else {
      aggs.push({ $sort: sortRule });
      aggs.push({ $skip: skip });
      aggs.push({ $limit: limit });
    }
    return aggs;
  }

  async getOneByCode(paymentCode: string): Promise<RawRotatorItemDocument> {
    const query: FilterQuery<Document> = { code: paymentCode };
    await this._beforeFilter(query);
    //@ts-ignore
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async getActiveAsync(
    cb: (item: RawRotatorItemDocument) => void,
  ): Promise<void> {
    for await (const item of this.Model.find({
      status: rotateStatus.ADDED,
    }).cursor()) {
      const doc = item.toJSON();
      try {
        cb(doc);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async getHistory(userId): Promise<Array<RawRotatorItemDocument>> {
    // TODO: paging & sorting & filters
    const list = await this.Model.find({
      user: userId,
      status: { $nin: [rotateStatus.REFER] },
    })
      .populate('list')
      .populate('user')
      .sort({ createdAt: 'DESC' });
    return list;
  }

  async getPending(userId): Promise<RawRotatorItemDocument | undefined> {
    const list = await this.Model.find({
      $and: [
        { user: userId },
        {
          $or: [{ status: rotateStatus.SELECT }],
        },
      ],
    })
      .populate('list')
      .populate('user');
    return list[0] ? list[0].toJSON() : undefined;
  }

  async getRandomFor(
    listId: ObjectId,
    userId: ObjectId,
    selected: Array<ItemSelectSimple>,
    defaultListSize: number,
    refer?: RawUserDocument | undefined,
  ): Promise<Array<RawRotatorItemDocumentForUi>> {
    const selectedIds = selected.map((item) => item.id);
    const referral = await this.getReferralItem(refer, listId);
    const isReferralSelected = referral
      ? selectedIds.some((id) => id.toString() === referral.id.toString())
      : false;

    // random scope filter
    const query = {
      _id: { $nin: [...selectedIds, referral ? referral.id : undefined] },
      list: listId,
      user: { $ne: userId },
      status: { $in: [rotateStatus.ADDED] },
    };

    let listSize = defaultListSize;
    let limit = listSize - selectedIds.length;
    if (referral) {
      limit -= 1;
    }
    const count = await this.Model.find(query).count();

    if (limit > count) {
      limit = count;
    }

    const referralFix = referral ? 1 : 0;
    if (listSize > count + selectedIds.length + referralFix) {
      listSize = count + selectedIds.length + referralFix;
    }

    const skips = sample(range(count), limit);

    let listIndex = 0;
    const list = await Promise.all(
      skips.map(async (skip) => {
        const item = this.Model.findOne(query, {}, { skip })
          .populate('list')
          .populate('user');
        return item;
      }),
    );

    const selectedList = await Promise.all(
      selectedIds.map(async (selectId) => {
        const item = this.Model.findOne({ _id: selectId })
          .populate('list')
          .populate('user');
        return item;
      }),
    );

    const resultList: Array<RawRotatorItemDocumentForUi> = [];

    // fill resultList with selected items
    selected.forEach(({ id, index }) => {
      const selectedItem = selectedList.find(
        (item) => item.id.toString() === id,
      );
      const selectedItemInfo = selected.find(
        (item) => item.id.toString() === id,
      );
      const { id: ii, index: i, ...rest } = selectedItemInfo;
      resultList[index] = {
        ...selectedItem.toJSON(),
        ...rest,
        isSelected: true,
      };
    });

    // fill empty resultList items with new items
    Array.from(Array(listSize)).forEach((i, index) => {
      if (index === 0 && referral && !isReferralSelected) {
        resultList[index] = {
          ...referral.toJSON(),
          isSelected: false,
        };
      }
      if (!resultList[index] && list[listIndex]) {
        const nextItem = list[listIndex];
        listIndex++;
        resultList[index] = {
          ...nextItem.toJSON(),
          isSelected: false,
        };
      }
    });

    return resultList;
  }

  private async getReferralItem(
    referUser?: RawUserDocument | undefined,
    listId?: ObjectId,
  ): Promise<RotatorItemDocument> {
    const userId = referUser ? referUser.id : undefined;
    if (!userId || !listId) {
      return undefined;
    }
    let query = {
      list: listId,
      user: { $eq: userId },
      status: { $in: [rotateStatus.ADDED] },
    };
    let item = await this.Model.findOne(query)
      .populate('list')
      .populate('user');
    if (!item) {
      // find in refer
      query = {
        list: listId,
        user: { $eq: userId },
        status: { $in: [rotateStatus.REFER] },
      };
      item = await this.Model.findOne(query).populate('list').populate('user');
    }
    if (!item) {
      // create refer
      const data = {
        list: listId,
        user: userId,
        code: '',
        removeAt: new Date(),
        status: rotateStatus.REFER,
        payType: 'BTC',
        payAddress: referUser ? referUser.btcAddress : '',
      };
      const ref = await this.create(data);
      item = await this.Model.findOne({ _id: ref.id })
        .populate('list')
        .populate('user');
    }
    return item;
  }
}
