import { Model, Document, LeanDocument, FilterQuery, Types } from 'mongoose';

export { Model, Document, LeanDocument, FilterQuery, Types } from 'mongoose';

const toObjectId = (id: any) => {
  return new Types.ObjectId(id);
};

const simpleKeys = ['$custom'];

type ListQueryFilter = Record<string, any>;

export type ListQuery = {
  filter?: ListQueryFilter;
  range?: Array<number>;
  sort?: Record<string, string>;
};

export type BaseDalOptions<T extends Document> = {
  Model: Model<T>;
};

export class BaseDal<T extends Document> {
  Model: Model<T>;

  constructor(props: BaseDalOptions<T>) {
    this.Model = props.Model;
  }

  async updateInternal(id: string, data: any) {
    const query: FilterQuery<Document> = { _id: id };
    delete data.createdAt;
    delete data.updatedAt;
    await this.Model.findOneAndUpdate(query, data);
    const doc = await this.Model.findOne(query);
    const obj = doc.toJSON();
    return obj;
  }

  async getCount(query: ListQuery): Promise<number> {
    const { filter } = query;
    const filterRule: FilterQuery<Document> = {};
    await this._beforeFilter(filterRule);
    if (filter) {
      Object.keys(filter).forEach((key: string) => {
        let value: any = filter[key];
        if (key === 'id') {
          if (Array.isArray(value)) {
            filterRule._id = {
              $in: value
                .filter((i) => i)
                .map((i) => {
                  if (typeof i === 'string') {
                    i = (i || '').trim();
                  }
                  return toObjectId(i);
                }),
            };
          } else {
            if (typeof value === 'string') {
              value = (value || '').trim();
            }
            filterRule._id = toObjectId(value);
          }
        } else if (this._isIgnoredFilterKey(key)) {
          // do nothing
        } else if (simpleKeys.indexOf(key) !== -1) {
          filterRule[key] = value;
        } else {
          if (Array.isArray(value)) {
            filterRule[key] = {
              $in: value
                .filter((i) => i)
                .map((i) => {
                  if (typeof i === 'string') {
                    i = (i || '').trim();
                  }
                  return toObjectId(i);
                }),
            };
          } else {
            if (typeof value === 'string') {
              value = (value || '').trim();
            }
            filterRule[key] = toObjectId(value);
          }
        }
      });
    }
    await this._beforeFindQuery(filterRule);
    const count = await this.Model.find(filterRule).count();
    return count;
  }

  async getList(query: ListQuery): Promise<Array<LeanDocument<T>>> {
    const { filter, range, sort } = query;
    const filterRule: FilterQuery<Document> = {};
    await this._beforeFilter(filterRule);
    if (filter) {
      Object.keys(filter).forEach((key) => {
        let value: any = filter[key];
        if (key === 'id') {
          if (Array.isArray(value)) {
            filterRule._id = {
              $in: value
                .filter((i) => i)
                .map((i) => {
                  if (typeof i === 'string') {
                    i = (i || '').trim();
                  }
                  return toObjectId(i);
                }),
            };
          } else {
            if (typeof value === 'string') {
              value = (value || '').trim();
            }
            filterRule._id = toObjectId(value);
          }
        } else if (this._isIgnoredFilterKey(key)) {
          // do nothing
        } else if (simpleKeys.indexOf(key) !== -1) {
          filterRule[key] = value;
        } else {
          if (Array.isArray(value)) {
            filterRule[key] = {
              $in: value
                .filter((i) => i)
                .map((i) => {
                  if (typeof i === 'string') {
                    i = (i || '').trim();
                  }
                  return toObjectId(i);
                }),
            };
          } else {
            if (typeof value === 'string') {
              value = (value || '').trim();
            }
            filterRule[key] = toObjectId(value);
          }
        }
      });
    }
    let skip = 0;
    let limit = undefined;
    if (range) {
      skip = range[0];
      limit = range[1] - range[0] + 1;
    }
    let sortRule = undefined;
    if (sort) {
      sortRule = { [sort[0]]: sort[1].toLowerCase() };
    }

    const [newSkip, newLimit] = await this._beforeSkipLimit(
      skip,
      limit,
      filter,
    );
    const defaultProjection = {};
    const projection = await this._beforeListProjection(
      defaultProjection,
      filter,
    );
    await this._beforeFindQuery(filterRule);
    const list = await this.Model.find(filterRule, projection)
      .skip(newSkip)
      .limit(newLimit)
      .sort(sortRule)
      .select(projection);
    return list.map((item) => item.toJSON());
  }

  async getOne(id): Promise<LeanDocument<T>> {
    const query: FilterQuery<Document> = { _id: id };
    await this._beforeFilter(query);
    const doc = await this.Model.findOne(query);
    if (doc) {
      return doc.toJSON();
    }
  }

  async update(id: string, data: any): Promise<LeanDocument<T>> {
    const query: FilterQuery<Document> = { _id: id };
    await this._beforeFilter(query);
    await this._beforeUpdate(data);
    delete data.createdAt;
    delete data.updatedAt;
    const old = await this.Model.findOneAndUpdate(query, data);
    const doc = await this.Model.findOne(query);
    const obj = doc.toJSON();
    await this._afterUpdate(old.toJSON(), obj);
    return obj;
  }

  async create(data: any): Promise<LeanDocument<T>> {
    await this._beforeCreate(data);
    delete data.createdAt;
    delete data.updatedAt;
    const doc = new this.Model(data);
    await doc.save();
    const obj = doc.toJSON();
    await this._afterCreate(obj);
    return obj;
  }

  async delete(id: string): Promise<LeanDocument<T>> {
    const query: FilterQuery<Document> = { _id: id };
    await this._beforeFilter(query);
    const doc = await this.Model.findOne(query);
    let obj;
    if (doc) {
      obj = doc.toJSON();
      await doc.delete();
      await this._afterDelete(obj);
    }
    return obj;
  }

  _isIgnoredFilterKey(key) {
    // if (key === '$custom') {
    //     return true;
    // }
    return false;
  }

  async _beforeSkipLimit(
    skip: number,
    limit: number,
    filter?: ListQueryFilter,
  ) {
    return [skip, limit];
  }

  async _beforeListProjection(projection, filter?: ListQueryFilter) {
    return projection;
  }

  async _beforeFilter(query: FilterQuery<Document>): Promise<void> {
    // _beforeFilter
  }

  async _beforeFindQuery(query: FilterQuery<Document>): Promise<void> {
    // _beforeFindQuery
  }

  async _beforeCreate(data: any): Promise<void> {
    // _beforeCreate
  }

  async _afterCreate(obj: LeanDocument<T>): Promise<void> {
    // _afterCreate
  }

  async _beforeUpdate(data: any): Promise<void> {
    // _beforeUpdate
  }

  async _afterUpdate(
    fromObj: LeanDocument<T>,
    toObj: LeanDocument<T>,
  ): Promise<void> {
    // _afterUpdate
  }

  async _afterDelete(obj: LeanDocument<T>): Promise<void> {
    //   _afterDelete
  }
}
