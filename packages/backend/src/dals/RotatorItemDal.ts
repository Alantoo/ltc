import { Document, FilterQuery, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, ListQuery, Model } from './BaseDal';

import {
  RotatorItem,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemSchema,
  RotatorItemCreateDto,
} from './schemas/RotatorItem';

import { User } from './schemas/User';

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
            id: '$_id',
            name: 1,
            email: 1,
          },
          list: {
            id: '$_id',
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
      aggs.push({ $skip: skip });
      aggs.push({ $limit: limit });
      aggs.push({ $sort: sortRule });
    }
    return aggs;
  }

  async getOneByCode(code: string): Promise<RawRotatorItemDocument> {
    const query: FilterQuery<Document> = { code };
    await this._beforeFilter(query);
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async getHistory(userId): Promise<Array<RawRotatorItemDocument>> {
    // TODO: paging & sorting & filters
    const list = await this.Model.find({
      user: userId,
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
  ): Promise<Array<RawRotatorItemDocument>> {
    const query = {
      list: listId,
      user: { $ne: userId },
    };

    let limit = 6;
    const count = await this.Model.find(query).count();

    if (limit > count) {
      limit = count;
    }

    const skips = sample(range(count), limit);

    const list = await Promise.all(
      skips.map(async (skip) => {
        const item = this.Model.findOne(query, {}, { skip })
          .populate('list')
          .populate('user');
        return item;
      }),
    );

    return list;
  }
}
