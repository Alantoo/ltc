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
import { PaymentService } from '../services/PaymentService';
import { Request } from 'express';
import { rotateStatus } from '../dals/RotatorItemDal';

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
  @UseGuards(UserAuthGuard)
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<RotatorItemDocument>> {
    return super.getList(query, user);
  }

  @Get('history')
  @UseGuards(UserAuthGuard)
  async getHistory(
    @User() user: UserData,
  ): Promise<Array<RawRotatorItemDocument>> {
    const list = await this.rotatorService.getHistory(user);
    return list;
  }

  @Get('status')
  @UseGuards(UserAuthGuard)
  async getStatus(
    @User() user: UserData,
  ): Promise<{ item: RawRotatorItemDocument; list: Array<RawListDocument> }> {
    const item = await this.rotatorService.getPending(user);
    const list = await this.listService.getList(undefined, user);
    return { item, list: list.data };
  }

  @Post('start')
  @UseGuards(UserAuthGuard)
  async start(
    @Body() body: { listId: string },
    @User() user: UserData,
  ): Promise<{ url: string }> {
    const { listId } = body || {};

    const list = await this.listService.getOne(listId, user);

    if (!list) {
      throw new NotFoundException(`List with "${listId}" id not found`);
    }

    const charge = await this.paymentService.chargesCreate({
      name: `List name - ${list.name}`,
      description: `List price - "$${list.price}"`,
      price: '1.11',
    });

    const data: RotatorItemCreateDto = {
      list: listId,
      user: user.id,
      code: charge.code,
    };

    await this.rotatorService.create(data, user);
    return { url: charge.hosted_url };
  }

  @Get(':id/status')
  @UseGuards(UserAuthGuard)
  async getUsers(
    @Param('id') id: string,
    @User() user: UserData,
  ): Promise<{
    item: RawRotatorItemDocument;
    list: Array<RawRotatorItemDocument>;
  }> {
    const { item, list } = await this.rotatorService.getStatus(id, user);
    return { item, list };
  }

  @Post(':id/select')
  @UseGuards(UserAuthGuard)
  async select(
    @Param('id') id: string,
    @Body() body: { userId: string },
    @User() user: UserData,
  ): Promise<{
    item: RawRotatorItemDocument;
    list: Array<RawRotatorItemDocument>;
  }> {
    const { userId } = body || {};
    const { item, list } = await this.rotatorService.selectUser(
      id,
      userId,
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

    console.log(`webhook event: "${event.type}" \n`);
    console.log(
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
  @UseGuards(UserAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<SingleResult<RotatorItemDocument>> {
    return super.getOne(id);
  }

  @Put(':id')
  @UseGuards(UserAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: RawRotatorItemDocument,
  ): Promise<SingleResult<RotatorItemDocument>> {
    return super.update(id, body);
  }
}
