import { Document, LeanDocument } from 'mongoose';
import { Logger } from '@nestjs/common';
import { DalService, ListResult, SingleResult } from '../services/DalService';
import { UserData } from '../services/AuthService';

type ApiControllerOptions<T extends Document> = {
  baseService: DalService<T>;
};

export class ApiController<T extends Document> {
  protected logger = new Logger(ApiController.name);

  baseService: DalService<T> | undefined;

  constructor(props: ApiControllerOptions<T>) {
    this.baseService = props.baseService;
  }

  async getList(query: any, user: UserData): Promise<ListResult<T>> {
    try {
      const sort = query.sort ? JSON.parse(query.sort) : null;
      const range = query.range ? JSON.parse(query.range) : null;
      const filter = query.filter ? JSON.parse(query.filter) : null;

      const data = await this.baseService.getList(
        { filter, range, sort },
        {}, //req.user,
      );
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} get list error: ${error}`);
      throw error;
    }
  }

  async getOne(id: string): Promise<SingleResult<T>> {
    try {
      const data = await this.baseService.getOne(id, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} get one error: ${error}`);
      throw error;
    }
  }

  async create(body: LeanDocument<T>): Promise<SingleResult<T>> {
    try {
      const data = await this.baseService.create(body, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} create error: ${error}`);
      throw error;
    }
  }

  async update(id: string, body: LeanDocument<T>): Promise<SingleResult<T>> {
    try {
      const data = await this.baseService.update(id, body, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} update error: ${error}`);
      throw error;
    }
  }

  async delete(id: string): Promise<SingleResult<T>> {
    try {
      const data = await this.baseService.delete(id, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} delete error: ${error}`);
      throw error;
    }
  }

  async deleteBunch(body: { ids: Array<string> }): Promise<Array<string>> {
    try {
      const { ids = [] } = body;
      const removed = await Promise.all(
        ids.map(async (id, index) => {
          try {
            await this.baseService.delete(id, {} /*req.user*/);
            return id;
          } catch (e) {
            return undefined;
          }
        }),
      );
      const data = removed.filter((i) => i);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} delete bunch error: ${error}`);
      throw error;
    }
  }
}
