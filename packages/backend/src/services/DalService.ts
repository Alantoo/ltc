import { Logger, NotFoundException } from '@nestjs/common';
import { BaseDal, Document, LeanDocument } from '../dals/BaseDal';
import { UserData } from './AuthService';

export type ListResult<T extends Document> = {
  data: Array<LeanDocument<T>>;
  total: number;
};

export type SingleResult<T extends Document> = LeanDocument<T>;

export type ListQuery = {
  filter?: any;
  range?: any;
  sort?: any;
};

export type DalServiceOptions<T extends Document> = {
  baseDal: BaseDal<T>;
};

export class DalService<T extends Document> {
  protected readonly logger = new Logger(DalService.name);

  protected baseDal: BaseDal<T>;

  constructor(props: DalServiceOptions<T>) {
    this.baseDal = props.baseDal;
  }

  async getList(query?: ListQuery, user?: UserData): Promise<ListResult<T>> {
    const { filter, range, sort } = query || {};
    await this._beforeListFilter(filter, user);
    await this._beforeListRange(range, user);
    await this._beforeListSort(sort, user);
    const [data, total] = await Promise.all([
      this.baseDal.getList({ filter, range, sort }),
      this.baseDal.getCount({ filter, range, sort }),
    ]);
    return { data, total };
  }

  async getOne(id, user): Promise<SingleResult<T> | undefined> {
    const idV = await this._beforeFilter(id, user);
    if (!idV) {
      throw new NotFoundException();
    }
    const obj = await this.baseDal.getOne(idV);
    return obj;
  }

  async create(data, user): Promise<SingleResult<T> | undefined> {
    await this._beforeCreate(data, user);
    const obj = await this.baseDal.create(data);
    await this._afterCreate(obj, user);
    return obj;
  }

  async update(id, data, user): Promise<SingleResult<T> | undefined> {
    const idV = await this._beforeFilter(id, user);
    if (!idV) {
      throw new NotFoundException();
    }
    const oldObj = await this.baseDal.getOne(idV);
    await this._beforeUpdate(data, user);
    const obj = await this.baseDal.update(idV, data);
    await this._afterUpdate(oldObj, obj, user);
    return obj;
  }

  async delete(id, user) {
    const idV = await this._beforeFilter(id, user);
    if (!idV) {
      throw new NotFoundException();
    }
    const obj = await this.baseDal.delete(idV);
    await this._afterDelete(obj, user);
    return obj;
  }

  async updateInternal(id, data) {
    return this.baseDal.updateInternal(id, data);
  }

  protected async _beforeListFilter(filter, user) {
    return filter;
  }

  protected async _beforeListRange(range, user) {
    return range;
  }

  protected async _beforeListSort(sort, user) {
    return sort;
  }

  protected async _beforeFilter(id, user) {
    return id;
  }

  protected async _beforeCreate(data, user) {
    // _beforeCreate
  }

  protected async _afterCreate(obj, user) {
    // _afterCreate
  }

  protected async _beforeUpdate(data, user) {
    // _beforeUpdate
  }

  protected async _afterUpdate(fromObj, toObj, user) {
    // _afterUpdate
  }

  protected async _afterDelete(obj, user) {
    // _afterDelete
  }
}
