import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import { ListDal, ListDocument, RawListDocument } from '../dals/ListDal';

export { RawListDocument, ListDocument, List } from '../dals/ListDal';

@Injectable()
export class ListService extends DalService<ListDocument> {
  listDal: ListDal;

  constructor(@Inject(ListDal) listDal: ListDal) {
    super({ baseDal: listDal });
    this.listDal = listDal;
  }
}
