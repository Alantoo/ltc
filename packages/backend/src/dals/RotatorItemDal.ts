import { ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model } from './BaseDal';

import {
  RotatorItem,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemSchema,
  RotatorItemCreateDto,
} from './schemas/RotatorItem';

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

  async getHistory(userId): Promise<Array<RawRotatorItemDocument>> {
    // TODO: paging & sorting & filters
    const list = await this.Model.find({
      user: userId,
    })
      .populate('list')
      .populate('user');
    return list;
  }

  async getPending(userId): Promise<RawRotatorItemDocument | undefined> {
    const list = await this.Model.find({
      $and: [
        { user: userId },
        {
          $or: [{ status: rotateStatus.PAY }, { status: rotateStatus.SELECT }],
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
