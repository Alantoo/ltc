import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseDal, ListQuery, Model } from './BaseDal';
import { User, UserDocument, RawUserDocument } from './schemas/User';

export {
  User,
  UserDocument,
  RawUserDocument,
  UserSchema,
  UserCreateDto,
  UserUpdateDto,
} from './schemas/User';

@Injectable()
export class UserDal extends BaseDal<UserDocument> {
  Model: Model<UserDocument>;

  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super({ Model: model });
    this.Model = model;
  }

  async getComplexCount(query: ListQuery): Promise<number> {
    const aggs = this.getComplexListAggregation(query, true);
    const list = await this.Model.aggregate(aggs);
    return list[0] ? list[0].count : 0;
  }

  async getComplexList(query: ListQuery): Promise<Array<RawUserDocument>> {
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
    let limit = undefined;
    if (range) {
      skip = range[0];
      limit = range[1] - range[0] + 1;
    }
    let sortRule = undefined;
    if (sort) {
      sortRule = { [sort[0]]: sort[1].toLowerCase() === 'asc' ? 1 : -1 };
    }
    const { query: queryStr = '', ...restFilters } = filter;
    const filterRule = {
      ...restFilters,
      $and: [
        {
          $or: [
            {
              name: { $regex: queryStr },
            },
            {
              email: { $regex: queryStr },
            },
            {
              'refer.name': { $regex: queryStr },
            },
            {
              'refer.email': { $regex: queryStr },
            },
          ],
        },
      ],
    };
    const aggs: Array<any> = [
      {
        $lookup: {
          from: 'users',
          localField: 'refer',
          foreignField: '_id',
          as: 'refer',
        },
      },
      { $unwind: { path: '$refer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: '$_id',
          email: 1,
          name: 1,
          isAdmin: 1,
          isBlocked: 1,
          isVerified: 1,
          refer: {
            _id: undefined,
            id: '$refer._id',
            email: 1,
            name: 1,
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

  async findByEmail(email: string): Promise<RawUserDocument | undefined> {
    const doc = await this.Model.findOne({ email });
    if (doc) {
      const obj = doc.toJSON();
      obj.password = doc.password;
      return obj;
    }
  }

  async findByName(name: string): Promise<RawUserDocument | undefined> {
    const doc = await this.Model.findOne({ name });
    if (doc) {
      const obj = doc.toJSON();
      return obj;
    }
  }

  async findByCode(code: string): Promise<RawUserDocument | undefined> {
    const doc = await this.Model.findOne({ code });
    if (doc) {
      const obj = doc.toJSON();
      return obj;
    }
  }
}
