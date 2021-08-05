import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DalService } from './DalService';
import {
  PayOutDal,
  PayOutDocument,
  RawPayOutDocument,
  PayOutCreateDto,
} from '../dals/PayOutDal';

export { PayOut, PayOutDocument, RawPayOutDocument } from '../dals/PayOutDal';

@Injectable()
export class PayOutService extends DalService<PayOutDocument> {
  private paySelectDal: PayOutDal;

  constructor(@Inject(PayOutDal) paySelectDal: PayOutDal) {
    super({ baseDal: paySelectDal });
    this.paySelectDal = paySelectDal;
  }

  async addSelectPay(data: PayOutCreateDto): Promise<RawPayOutDocument> {
    const item = await this.paySelectDal.create(data);
    return item;
  }

  async getCountForUser(userId: string): Promise<number> {
    const count = await this.paySelectDal.getCountForUser(userId);
    return count;
  }

  async _beforeUpdate(data, user) {
    delete data.status;
    delete data.tx;
    return super._beforeUpdate(data, user);
  }
}
