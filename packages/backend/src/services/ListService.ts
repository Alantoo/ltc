import parse from 'parse-duration';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DalService } from './DalService';
import { ListDal, ListDocument, RawListDocument } from '../dals/ListDal';

export { RawListDocument, ListDocument, List } from '../dals/ListDal';

export type ListConfig = RawListDocument & {
  rotateTimeMs: number;
};

@Injectable()
export class ListService extends DalService<ListDocument> {
  protected readonly logger = new Logger(ListService.name);

  private listDal: ListDal;

  constructor(@Inject(ListDal) listDal: ListDal) {
    super({ baseDal: listDal });
    this.listDal = listDal;
  }

  async getListConfig(listId): Promise<ListConfig> {
    const item = await this.getOne(listId, {});
    let rotateTimeMs = 1000 * 60 * 60 * 24 * 60; // 60 d
    try {
      const num = parse(item.rotateTime);
      if (!Number.isNaN(num)) {
        rotateTimeMs = num;
      }
    } catch (err) {
      this.logger.error(
        `Wrong time format "${item.rotateTime}" for list "${item.name}"`,
      );
    }

    return {
      ...item,
      selectCount: item.selectCount || 6,
      rotateTimeMs,
    };
  }
}
