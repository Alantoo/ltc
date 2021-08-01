import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import {
  PaySelectDal,
  PaySelectDocument,
  RawPaySelectDocument,
  PaySelectCreateDto,
} from '../dals/PaySelectDal';

export {
  PaySelect,
  PaySelectDocument,
  RawPaySelectDocument,
} from '../dals/PaySelectDal';

@Injectable()
export class PaySelectService extends DalService<PaySelectDocument> {
  private paySelectDal: PaySelectDal;

  constructor(@Inject(PaySelectDal) paySelectDal: PaySelectDal) {
    super({ baseDal: paySelectDal });
    this.paySelectDal = paySelectDal;
  }

  async addSelectPay(data: PaySelectCreateDto): Promise<RawPaySelectDocument> {
    const item = await this.paySelectDal.create(data);
    return item;
  }

  async getCountForUser(userId: string): Promise<number> {
    const count = await this.paySelectDal.getCountForUser(userId);
    return count;
  }
}
