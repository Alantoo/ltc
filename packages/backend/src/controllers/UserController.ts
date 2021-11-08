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
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiController } from './ApiController';
import { roles, AuthRoles, User, UserData } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  User as UserModel,
  UserService,
  UserDocument,
  RawUserDocument,
} from '../services/UserService';
import { RewardService, RewardDocument } from '../services/RewardService';
import { AuthService } from '../services/AuthService';

@ApiTags('users')
@Controller('api/users')
export class UserController extends ApiController<UserDocument> {
  protected logger = new Logger(UserController.name);

  private userService: UserService;
  private rewardService: RewardService;
  private authService: AuthService;

  constructor(
    @Inject(UserService) userService: UserService,
    @Inject(RewardService) rewardService: RewardService,
    @Inject(AuthService) authService: AuthService,
  ) {
    super({ baseService: userService });
    this.userService = userService;
    this.rewardService = rewardService;
    this.authService = authService;
  }

  @Get()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<UserDocument>> {
    try {
      const sort = query.sort ? JSON.parse(query.sort) : undefined;
      const range = query.range ? JSON.parse(query.range) : undefined;
      const filter = query.filter ? JSON.parse(query.filter) : undefined;

      const data = await this.userService.getComplexList(
        { filter, range, sort },
        user,
      );
      return data;
    } catch (error) {
      this.logger.log(`${this.constructor.name} get list error: ${error}`);
      throw error;
    }
  }

  @ApiResponse({ type: UserModel })
  @Get('/me/referrals')
  @UseGuards(AuthRoles([]))
  async getReferrals(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<UserDocument>> {
    try {
      const sort = query.sort ? JSON.parse(query.sort) : undefined;
      const range = query.range ? JSON.parse(query.range) : undefined;
      const filter = query.filter ? JSON.parse(query.filter) : {};

      filter['refer.id'] = user.id;

      const data = await this.userService.getComplexList(
        { filter, range, sort },
        user,
      );
      return data;
    } catch (error) {
      this.logger.log(
        `${this.constructor.name} get referrals list error: ${error}`,
      );
      throw error;
    }
  }

  @ApiResponse({ type: UserModel })
  @Get('/me/rewards')
  @UseGuards(AuthRoles([]))
  async getRewards(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<RewardDocument>> {
    try {
      const sort = query.sort ? JSON.parse(query.sort) : undefined;
      const range = query.range ? JSON.parse(query.range) : undefined;
      const filter = query.filter ? JSON.parse(query.filter) : {};

      filter['toUser.id'] = user.id;

      const data = await this.rewardService.getComplexList(
        { filter, range, sort },
        user,
      );
      return data;
    } catch (error) {
      this.logger.log(
        `${this.constructor.name} get referrals list error: ${error}`,
      );
      throw error;
    }
  }

  @ApiResponse({ type: UserModel })
  @Get('/me/balance')
  @UseGuards(AuthRoles([]))
  async getBalance(@User() user: UserData): Promise<{ balance: number }> {
    const obj: RawUserDocument = await super.getOne(user.id, user);
    if (!user.isAdmin && user.id.toString() !== obj.id.toString()) {
      throw new UnauthorizedException();
    }
    return { balance: obj.balance };
  }

  @ApiResponse({ type: UserModel })
  @Get(':id')
  @UseGuards(AuthRoles([]))
  async getOne(
    @Param('id') id: string,
    @User() user: UserData,
  ): Promise<SingleResult<UserDocument>> {
    // check admin or owner
    const obj: RawUserDocument = await super.getOne(id, user);
    if (!user.isAdmin && user.id.toString() !== obj.id.toString()) {
      throw new UnauthorizedException();
    }
    return obj;
  }

  @Post()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async create(
    @Body() body: RawUserDocument,
  ): Promise<SingleResult<UserDocument>> {
    body.password = this.authService.encodePass(body.password || '123456789');
    return super.create(body);
  }

  @Put(':id')
  @UseGuards(AuthRoles([]))
  async update(
    @Param('id') id: string,
    @Body() body: RawUserDocument,
    @User() user: UserData,
  ): Promise<SingleResult<UserDocument>> {
    // check admin or owner
    const obj: RawUserDocument = await super.getOne(id, user);
    if (!user.isAdmin && user.id.toString() !== obj.id.toString()) {
      throw new UnauthorizedException();
    }
    if (!user.isAdmin) {
      delete body.isAdmin;
      delete body.isBlocked;
    }
    if (body.password) {
      body.password = this.authService.encodePass(body.password);
    }
    return super.update(id, body, user);
  }

  @Delete(':id')
  @UseGuards(AuthRoles([]))
  async delete(
    @Param('id') id: string,
    @User() user: UserData,
  ): Promise<SingleResult<UserDocument>> {
    // check admin or owner
    const obj: RawUserDocument = await super.getOne(id, user);
    if (user.id.toString() === obj.id.toString()) {
      throw new UnprocessableEntityException('User can not delete himself');
    }
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }
    return super.delete(id, user);
  }

  @Delete()
  @UseGuards(AuthRoles([roles.ADMIN]))
  async deleteBunch(
    @Body() body: { ids: Array<string> },
  ): Promise<Array<string>> {
    return super.deleteBunch(body);
  }
}
