import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import {
  RotatorItemDal,
  RotatorItemDocument,
  RawRotatorItemDocument,
} from '../dals/RotatorItemDal';

export {
  RawRotatorItemDocument,
  RotatorItemDocument,
  RotatorItem,
} from '../dals/RotatorItemDal';

@Injectable()
export class RotatorService extends DalService<RotatorItemDocument> {
  rotatorItemDal: RotatorItemDal;

  constructor(@Inject(RotatorItemDal) rotatorItemDal: RotatorItemDal) {
    super({ baseDal: rotatorItemDal });
    this.rotatorItemDal = rotatorItemDal;
  }
}
