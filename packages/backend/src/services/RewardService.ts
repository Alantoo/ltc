import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DalService, ListQuery, ListResult } from './DalService';
import {
  RewardDal,
  RewardDocument,
  RawRewardDocument,
  RewardCreateDto,
} from '../dals/RewardDal';
import { UserData } from './AuthService';

export { Reward, RewardDocument, RawRewardDocument } from '../dals/RewardDal';

@Injectable()
export class RewardService extends DalService<RewardDocument> {
  private rewardDal: RewardDal;

  constructor(@Inject(RewardDal) paySelectDal: RewardDal) {
    super({ baseDal: paySelectDal });
    this.rewardDal = paySelectDal;
  }

  async getComplexList(
    query?: ListQuery,
    user?: UserData,
  ): Promise<ListResult<RewardDocument>> {
    const { filter, range, sort } = query || {};
    await this._beforeListFilter(filter, user);
    await this._beforeListRange(range, user);
    await this._beforeListSort(sort, user);
    const [data, total] = await Promise.all([
      this.rewardDal.getComplexList({ filter, range, sort }),
      this.rewardDal.getComplexCount({ filter, range, sort }),
    ]);
    return { data, total };
  }

  async addRecord(data: RewardCreateDto): Promise<RawRewardDocument> {
    const item = await this.rewardDal.create(data);
    return item;
  }

  async getCountForUser(userId: string): Promise<number> {
    const count = await this.rewardDal.getCountForUser(userId);
    return count;
  }

  async _beforeUpdate(data, user) {
    delete data.status;
    delete data.tx;
    return super._beforeUpdate(data, user);
  }
}
