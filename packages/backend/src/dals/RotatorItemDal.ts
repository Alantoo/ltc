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

@Injectable()
export class RotatorItemDal extends BaseDal<RotatorItemDocument> {
  Model: Model<RotatorItemDocument>;

  constructor(
    @InjectModel(RotatorItem.name) model: Model<RotatorItemDocument>,
  ) {
    super({ Model: model });
    this.Model = model;
  }

  async getPending(userId): Promise<RawRotatorItemDocument | undefined> {
    const list = await this.Model.find({
      $and: [
        { userId },
        {
          $or: [{ status: rotateStatus.PAY }, { status: rotateStatus.SELECT }],
        },
      ],
    });
    return list[0] ? list[0].toJSON() : undefined;
  }

  async getRandomFor(
    listId: ObjectId,
    userId: ObjectId,
  ): Promise<Array<RawRotatorItemDocument>> {
    const list = await this.Model.find({
      listId,
      userId: { $ne: userId },
    })
      .skip(0)
      .limit(6);
    return list.map((i) => i.toJSON());
  }
}
