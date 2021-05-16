import { Document, LeanDocument } from 'mongoose';
import {
  Get,
  Post,
  Put,
  Delete,
  Logger,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DalService, ListResult, SingleResult } from '../services/DalService';
import { UserAuthGuard } from '../services/AuthService';

type ErrorResult = {
  error: true;
  message: string;
};

type ApiControllerOptions<T extends Document> = {
  baseService: DalService<T>;
};

@UseGuards(UserAuthGuard)
export class ApiController<T extends Document> {
  protected logger = new Logger(ApiController.name);

  baseService: DalService<T> | undefined;

  constructor(props: ApiControllerOptions<T>) {
    this.baseService = props.baseService;
  }

  @Get()
  async getList(@Query() query): Promise<ListResult<T> | ErrorResult> {
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

  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<SingleResult<T> | ErrorResult> {
    try {
      const data = await this.baseService.getOne(id, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} get one error: ${error}`);
      throw error;
    }
  }

  @Post()
  async create(
    @Body() body: LeanDocument<T>,
  ): Promise<SingleResult<T> | ErrorResult> {
    try {
      const data = await this.baseService.create(body, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} create error: ${error}`);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: LeanDocument<T>,
  ): Promise<SingleResult<T> | ErrorResult> {
    try {
      const data = await this.baseService.update(id, body, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} update error: ${error}`);
      throw error;
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<SingleResult<T> | ErrorResult> {
    try {
      const data = await this.baseService.delete(id, {} /*req.user*/);
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} delete error: ${error}`);
      throw error;
    }
  }

  @Delete()
  async deleteBunch(
    @Body() body: { ids: Array<string> },
  ): Promise<Array<string> | ErrorResult> {
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
