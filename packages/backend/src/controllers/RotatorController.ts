import {
  Inject,
  Controller,
  UseGuards,
  Logger,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiController } from './ApiController';
import { UserAuthGuard, User, UserData } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  RotatorItem as RotatorItemModel,
  RotatorService,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemCreateDto,
  ItemStatus,
} from '../services/RotatorService';
import { ListService, RawListDocument } from '../services/ListService';
import { UserService, RawUserDocument } from '../services/UserService';

@ApiTags('rotator')
@UseGuards(UserAuthGuard)
@Controller('api/rotator')
export class RotatorController extends ApiController<RotatorItemDocument> {
  protected logger = new Logger(RotatorController.name);

  rotatorService: RotatorService;
  listService: ListService;
  userService: UserService;

  constructor(
    @Inject(RotatorService) rotatorService: RotatorService,
    @Inject(ListService) listService: ListService,
    @Inject(UserService) userService: UserService,
  ) {
    super({ baseService: rotatorService });
    this.rotatorService = rotatorService;
    this.listService = listService;
    this.userService = userService;
  }

  @Get()
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<RotatorItemDocument>> {
    return super.getList(query, user);
  }

  @Get('history')
  async getHistory(
    @User() user: UserData,
  ): Promise<Array<RawRotatorItemDocument>> {
    const list = await this.rotatorService.getHistory(user);
    return list;
  }

  @Get('status')
  async getStatus(
    @User() user: UserData,
  ): Promise<{ item: RawRotatorItemDocument; list: Array<RawListDocument> }> {
    const item = await this.rotatorService.getPending(user);
    const list = await this.listService.getList(undefined, user);
    return { item, list: list.data };
  }

  @Post('start')
  async start(
    @Body() body: { listId: string },
    @User() user: UserData,
  ): Promise<{ item: RawRotatorItemDocument; list: Array<RawUserDocument> }> {
    const { listId } = body || {};
    const data: RotatorItemCreateDto = {
      listId,
      userId: user.id,
    };

    const item = await this.rotatorService.create(data, user);
    return { item, list: [] };
  }

  @Get(':id/status')
  async getUsers(
    @Param('id') id: string,
    @User() user: UserData,
  ): Promise<{ item: RawRotatorItemDocument; list: Array<RawUserDocument> }> {
    const { item, list } = await this.rotatorService.getStatus(id, user);
    const usersIds = list.map((i) => i.userId);
    const users = await this.userService.getList({ filter: { id: usersIds } });
    return {
      item,
      list: list.map((rotatorItem) => {
        const userObj = users.data.find(
          (elem) => elem.id.toString() === rotatorItem.userId.toString(),
        );
        return {
          ...userObj,
          itemId: rotatorItem.id,
        };
      }),
    };
  }

  @Post(':id/select')
  async select(
    @Param('id') id: string,
    @Body() body: { userId: string },
    @User() user: UserData,
  ): Promise<{ item: RawRotatorItemDocument; list: Array<RawUserDocument> }> {
    const { userId } = body || {};
    const { item, list } = await this.rotatorService.selectUser(
      id,
      userId,
      user,
    );
    const usersIds = list.map((i) => i.userId);
    const users = await this.userService.getList({ filter: { id: usersIds } });
    return {
      item,
      list: list.map((rotatorItem) => {
        const userObj = users.data.find(
          (elem) => elem.id.toString() === rotatorItem.userId.toString(),
        );
        return {
          ...userObj,
          itemId: rotatorItem.id,
        };
      }),
    };
  }

  @ApiResponse({ type: RotatorItemModel })
  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<SingleResult<RotatorItemDocument>> {
    return super.getOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: RawRotatorItemDocument,
  ): Promise<SingleResult<RotatorItemDocument>> {
    return super.update(id, body);
  }
}
