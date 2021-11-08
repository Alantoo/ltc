import {
  Inject,
  Controller,
  UseGuards,
  Logger,
  Get,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiController } from './ApiController';
import { roles, AuthRoles, User, UserData } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  Reward as RewardModel,
  RewardService,
  RewardDocument,
  RawRewardDocument,
} from '../services/RewardService';

type ErrorObj = {
  error: string | Record<string, string>;
};

const addressRegExp = /^0x[a-fA-F0-9]{40}$/;

@ApiTags('rewards')
@Controller('api/rewards')
export class RewardController extends ApiController<RewardDocument> {
  protected logger = new Logger(RewardController.name);

  rewardService: RewardService;

  userService: UserService;

  constructor(
    @Inject(RewardService) rewardService: RewardService,
    @Inject(UserService) userService: UserService,
  ) {
    super({ baseService: rewardService });
    this.rewardService = rewardService;
    this.userService = userService;
  }

  @Get()
  @UseGuards(AuthRoles([]))
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<RewardDocument>> {
    const sort = query.sort ? JSON.parse(query.sort) : undefined;
    const range = query.range ? JSON.parse(query.range) : undefined;
    const filter = query.filter ? JSON.parse(query.filter) : undefined;

    return this.rewardService.getComplexList({ filter, range, sort }, user);
  }

  @ApiResponse({ type: RewardModel })
  @Get(':id')
  @UseGuards(AuthRoles([]))
  async getOne(@Param('id') id: string): Promise<SingleResult<RewardDocument>> {
    // check owner or admin
    return super.getOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthRoles([roles.ADMIN]))
  async delete(@Param('id') id: string): Promise<SingleResult<RewardDocument>> {
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
