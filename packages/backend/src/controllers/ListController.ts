import {
  Inject,
  Controller,
  UseGuards,
  Logger,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiController, ErrorResult } from './ApiController';
import { UserAuthGuard, User, UserData } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  List as ListModel,
  ListService,
  ListDocument,
  RawListDocument,
} from '../services/ListService';

@ApiTags('lists')
@UseGuards(UserAuthGuard)
@Controller('api/lists')
export class ListController extends ApiController<ListDocument> {
  protected logger = new Logger(ListController.name);

  listService: ListService;

  constructor(@Inject(ListService) listService: ListService) {
    super({ baseService: listService });
    this.listService = listService;
  }

  @Get()
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<ListDocument> | ErrorResult> {
    return super.getList(query, user);
  }

  @ApiResponse({ type: ListModel })
  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<SingleResult<ListDocument> | ErrorResult> {
    return super.getOne(id);
  }

  @ApiResponse({ type: ListModel })
  @Post()
  async create(
    @Body() body: RawListDocument,
  ): Promise<SingleResult<ListDocument> | ErrorResult> {
    return super.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: RawListDocument,
  ): Promise<SingleResult<ListDocument> | ErrorResult> {
    return super.update(id, body);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<SingleResult<ListDocument> | ErrorResult> {
    return super.delete(id);
  }

  @Delete()
  async deleteBunch(
    @Body() body: { ids: Array<string> },
  ): Promise<Array<string> | ErrorResult> {
    return super.deleteBunch(body);
  }
}
