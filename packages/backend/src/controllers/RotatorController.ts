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
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiController } from './ApiController';
import { roles, AuthRoles, User, UserData } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  RotatorItem as RotatorItemModel,
  RotatorService,
  RotatorItemDocument,
  RawRotatorItemDocument,
  RotatorItemCreateDto,
  ItemStatus,
  rotateStatus,
} from '../services/RotatorService';
import { ListService, RawListDocument } from '../services/ListService';
import { UserService } from '../services/UserService';
import { PaymentService } from '../services/PaymentService';
import { Request } from 'express';

@ApiTags('rotator')
@Controller('api/rotator')
export class RotatorController extends ApiController<RotatorItemDocument> {
  protected logger = new Logger(RotatorController.name);

  rotatorService: RotatorService;
  listService: ListService;
  userService: UserService;
  paymentService: PaymentService;

  constructor(
    @Inject(RotatorService) rotatorService: RotatorService,
    @Inject(ListService) listService: ListService,
    @Inject(UserService) userService: UserService,
    @Inject(PaymentService) paymentService: PaymentService,
  ) {
    super({ baseService: rotatorService });
    this.rotatorService = rotatorService;
    this.listService = listService;
    this.userService = userService;
    this.paymentService = paymentService;
  }

  @Get()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<RotatorItemDocument>> {
    try {
      const sort = query.sort ? JSON.parse(query.sort) : undefined;
      const range = query.range ? JSON.parse(query.range) : undefined;
      const filter = query.filter ? JSON.parse(query.filter) : undefined;

      const data = await this.rotatorService.getComplexList(
        { filter, range, sort },
        user,
      );
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} get list error: ${error}`);
      throw error;
    }
  }

  @Get('history')
  @UseGuards(AuthRoles([]))
  async getHistory(
    @User() user: UserData,
  ): Promise<Array<RawRotatorItemDocument>> {
    const list = await this.rotatorService.getHistory(user);
    return list;
  }

  @Get('status')
  @UseGuards(AuthRoles([]))
  async getStatus(
    @User() user: UserData,
  ): Promise<{ item: RawRotatorItemDocument; list: Array<RawListDocument> }> {
    const item = await this.rotatorService.getPending(user);
    const list = await this.listService.getList(undefined, user);
    return { item, list: list.data };
  }

  @Post('start')
  @UseGuards(AuthRoles([]))
  async start(
    @Body() body: { listId: string; direct: boolean },
    @User() user: UserData,
  ): Promise<{ url: string }> {
    const { listId, direct } = body || {};

    const list = await this.listService.getOne(listId, user);

    if (!list) {
      throw new NotFoundException(`List with "${listId}" id not found`);
    }

    // TODO: remove for Production
    if (direct) {
      const data: RotatorItemCreateDto = {
        list: listId,
        user: user.id,
        status: rotateStatus.SELECT,
      };

      await this.rotatorService.create(data, user);
      return { url: '' };
    } else {
      const charge = await this.paymentService.chargesCreate({
        name: `List name - ${list.name}`,
        description: `List price - "$${list.price}"`,
        price: '1.11',
      });

      const data: RotatorItemCreateDto = {
        list: listId,
        user: user.id,
        code: charge.code,
        status: rotateStatus.PAY,
      };

      await this.rotatorService.create(data, user);
      return { url: charge.hosted_url };
    }
  }

  @Get(':id/status')
  @UseGuards(AuthRoles([]))
  async getUsers(
    @Param('id') id: string,
    @User() user: UserData,
  ): Promise<ItemStatus> {
    const { item, list } = await this.rotatorService.getStatus(id, user);
    return { item, list };
  }

  @Post(':id/select')
  @UseGuards(AuthRoles([]))
  async select(
    @Param('id') id: string,
    @Body() body: { selectedItemId: string; index: number },
    @User() user: UserData,
  ): Promise<ItemStatus> {
    const { selectedItemId, index } = body || {};
    const { item, list } = await this.rotatorService.selectUser(
      id,
      selectedItemId,
      index,
      user,
    );
    return { item, list };
  }

  @Post('webhook')
  async onWebhook(@Req() request: Request): Promise<void> {
    const bodyStr = JSON.stringify(request.body);
    const signature = request.headers['x-cc-webhook-signature'];
    const event = await this.paymentService.getEvent(
      bodyStr,
      signature as string,
    );

    this.logger.log(`webhook event: "${event.type}" \n`);
    this.logger.log(
      JSON.stringify(
        {
          code: event.data.code,
          hosted_url: event.data.hosted_url,
        },
        null,
        2,
      ),
    );

    await this.rotatorService.updateStatus(event.data.code, event.type);
  }

  @ApiResponse({ type: RotatorItemModel })
  @UseGuards(AuthRoles([roles.ADMIN]))
  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<SingleResult<RotatorItemDocument>> {
    return super.getOne(id);
  }

  @Put(':id')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async update(
    @Param('id') id: string,
    @Body() body: RawRotatorItemDocument,
  ): Promise<SingleResult<RotatorItemDocument>> {
    return super.update(id, body);
  }
}
