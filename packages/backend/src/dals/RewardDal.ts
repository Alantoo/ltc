import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, ListQuery, Model, Types } from './BaseDal';
import { Reward, RewardDocument, RawRewardDocument } from './schemas/Reward';

export {
  Reward,
  RewardDocument,
  RawRewardDocument,
  RewardSchema,
  RewardCreateDto,
} from './schemas/Reward';

@Injectable()
export class RewardDal extends BaseDal<RewardDocument> {
  Model: Model<RewardDocument>;

  constructor(@InjectModel(Reward.name) model: Model<RewardDocument>) {
    super({ Model: model });
    this.Model = model;
  }

  async getComplexCount(query: ListQuery): Promise<number> {
    const aggs = this.getComplexListAggregation(query, true);
    const list = await this.Model.aggregate(aggs);
    return list[0] ? list[0].count : 0;
  }

  async getComplexList(query: ListQuery): Promise<Array<RawRewardDocument>> {
    const aggs = this.getComplexListAggregation(query);
    const list = await this.Model.aggregate(aggs);
    return list;
  }

  private getComplexListAggregation(
    query: ListQuery,
    isCount = false,
  ): Array<any> {
    const { filter, range, sort } = query;
    let skip = 0;
    let limit = 100;
    if (range) {
      skip = range[0];
      limit = range[1] - range[0] + 1;
    }
    let sortRule: Record<string, number> = { createdAt: 1 };
    if (sort) {
      sortRule = { [sort[0]]: sort[1].toLowerCase() === 'asc' ? 1 : -1 };
    }
    const { query: queryStr = '', ...restFilters } = filter;
    const filterRule = {
      ...restFilters,
      // $and: [
      //   {
      //     $or: [
      //       {
      //         name: { $regex: queryStr },
      //       },
      //       {
      //         email: { $regex: queryStr },
      //       },
      //       {
      //         'refer.name': { $regex: queryStr },
      //       },
      //       {
      //         'refer.email': { $regex: queryStr },
      //       },
      //     ],
      //   },
      // ],
    };
    const aggs: Array<any> = [
      {
        $lookup: {
          from: 'lists',
          localField: 'listId',
          foreignField: '_id',
          as: 'list',
        },
      },
      { $unwind: { path: '$list', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'toUserId',
          foreignField: '_id',
          as: 'toUser',
        },
      },
      { $unwind: { path: '$toUser', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'fromUserId',
          foreignField: '_id',
          as: 'fromUser',
        },
      },
      { $unwind: { path: '$fromUser', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: undefined,
          id: '$_id',
          payType: 1,
          payAddress: 1,
          payAmount: 1,
          payTx: 1,
          createdAt: 1,
          list: {
            _id: undefined,
            id: '$list._id',
            name: 1,
          },
          toUser: {
            _id: undefined,
            id: '$toUser._id',
            name: 1,
            email: 1,
          },
          fromUser: {
            _id: undefined,
            id: '$fromUser._id',
            name: 1,
            email: 1,
          },
        },
      },
      { $match: filterRule },
    ];
    if (isCount) {
      aggs.push({ $count: 'count' });
    } else {
      aggs.push({ $sort: sortRule });
      aggs.push({ $skip: skip });
      aggs.push({ $limit: limit });
    }
    return aggs;
  }

  async getCountForUser(userId: string): Promise<number> {
    const aggItem = await this.Model.aggregate([
      { $match: { userId: Types.ObjectId(userId) } },
      { $group: { _id: '$userId', amount: { $sum: '$amount' } } },
    ]);
    return aggItem[0] ? aggItem[0].amount : 0;
  }
}
