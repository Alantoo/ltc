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
import axios from 'axios';
import { ApiController } from './ApiController';
import { roles, AuthRoles, User, UserData } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  PayOut as PauOutModel,
  PayOutService,
  PayOutDocument,
  RawPayOutDocument,
} from '../services/PayOutService';

type ErrorObj = {
  error: string | Record<string, string>;
};

const addressRegExp = /^0x[a-fA-F0-9]{40}$/;

@ApiTags('lists')
@Controller('api/payouts')
export class PayOutController extends ApiController<PayOutDocument> {
  protected logger = new Logger(PayOutController.name);

  payOutService: PayOutService;

  userService: UserService;

  constructor(
    @Inject(PayOutService) payOutService: PayOutService,
    @Inject(UserService) userService: UserService,
  ) {
    super({ baseService: payOutService });
    this.payOutService = payOutService;
    this.userService = userService;
  }

  @Get('/rates')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async rates(): Promise<{ eth: number }> {
    const ethUrl = `https://api.blockchain.com/v3/exchange/tickers/ETH-USD`;
    const result = await axios.get(ethUrl, {
      timeout: 5000,
    });
    return { eth: result.data.price_24h };
  }

  @Post(':id/pay')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async payApprove(
    @Param('id') id: string,
    @Body() body: { rates: number; amountEth: number; tx: string },
  ): Promise<SingleResult<PayOutDocument>> {
    const data = await this.payOutService.updateInternal(id, {
      rates: body.rates,
      amountEth: body.amountEth,
      tx: body.tx,
      status: 'done',
    });
    return data;
  }

  @Get()
  @UseGuards(AuthRoles([]))
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<PayOutDocument>> {
    // check owner or admin
    return super.getList(query, user);
  }

  @ApiResponse({ type: PauOutModel })
  @Get(':id')
  @UseGuards(AuthRoles([]))
  async getOne(@Param('id') id: string): Promise<SingleResult<PayOutDocument>> {
    // check owner or admin
    return super.getOne(id);
  }

  @ApiResponse({ type: PauOutModel })
  @Post()
  @UseGuards(AuthRoles([]))
  async createNew(
    @Body() body: { amount: string; address: string },
    @User() user: UserData,
  ): Promise<ErrorObj | SingleResult<PayOutDocument>> {
    // check owner or admin
    const amountNum = parseInt(body.amount, 10);
    if (
      !body.amount ||
      isNaN(amountNum) ||
      amountNum <= 0 ||
      amountNum > user.balance
    ) {
      return {
        error: {
          amount: 'Incorrect amount',
        },
      };
    }

    if (!body.address || !addressRegExp.test(body.address)) {
      return {
        error: {
          address: 'Incorrect address',
        },
      };
    }

    const res = await super.create({
      amount: amountNum,
      address: body.address,
      status: 'pending',
      userId: user.id,
    });

    await this.userService.decrementBalance(user.id, amountNum);

    return res;
  }

  @Put(':id')
  @UseGuards(AuthRoles([]))
  async update(
    @Param('id') id: string,
    @Body() body: RawPayOutDocument,
  ): Promise<SingleResult<PayOutDocument>> {
    // check owner or admin
    return super.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async delete(@Param('id') id: string): Promise<SingleResult<PayOutDocument>> {
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
