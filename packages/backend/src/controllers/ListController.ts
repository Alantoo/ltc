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
import { ApiController } from './ApiController';
import { roles, AuthRoles, User, UserData } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  List as ListModel,
  ListService,
  ListDocument,
  RawListDocument,
} from '../services/ListService';

@ApiTags('lists')
@Controller('api/lists')
export class ListController extends ApiController<ListDocument> {
  protected logger = new Logger(ListController.name);

  listService: ListService;

  constructor(@Inject(ListService) listService: ListService) {
    super({ baseService: listService });
    this.listService = listService;
  }

  @Get()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<ListDocument>> {
    return super.getList(query, user);
  }

  @ApiResponse({ type: ListModel })
  @Get(':id')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async getOne(@Param('id') id: string): Promise<SingleResult<ListDocument>> {
    return super.getOne(id);
  }

  @ApiResponse({ type: ListModel })
  @Post()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async create(
    @Body() body: RawListDocument,
  ): Promise<SingleResult<ListDocument>> {
    return super.create(body);
  }

  @Put(':id')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async update(
    @Param('id') id: string,
    @Body() body: RawListDocument,
  ): Promise<SingleResult<ListDocument>> {
    return super.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async delete(@Param('id') id: string): Promise<SingleResult<ListDocument>> {
    return super.delete(id);
  }

  @Delete()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async deleteBunch(
    @Body() body: { ids: Array<string> },
  ): Promise<Array<string>> {
    return super.deleteBunch(body);
  }
}
