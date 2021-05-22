import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model } from './BaseDal';
import {
  RotatorItem,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemSchema,
} from './schemas/RotatorItem';

export {
  RotatorItem,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemSchema,
} from './schemas/RotatorItem';

@Injectable()
export class RotatorItemDal extends BaseDal<RotatorItemDocument> {
  Model: Model<RotatorItemDocument>;

  constructor(
    @InjectModel(RotatorItem.name) model: Model<RotatorItemDocument>,
  ) {
    super({ Model: model });
    this.Model = model;
  }
}
