import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, Model } from './BaseDal';
import { List, ListDocument } from './schemas/List';

export {
  List,
  ListDocument,
  RawListDocument,
  ListSchema,
} from './schemas/List';

@Injectable()
export class ListDal extends BaseDal<ListDocument> {
  Model: Model<ListDocument>;

  constructor(@InjectModel(List.name) model: Model<ListDocument>) {
    super({ Model: model });
    this.Model = model;
  }
}
