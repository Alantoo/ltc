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
import { UserAuthGuard, User, UserData } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  User as UserModel,
  UserService,
  UserDocument,
  RawUserDocument,
} from '../services/UserService';
import { AuthService } from '../services/AuthService';

@ApiTags('users')
@UseGuards(UserAuthGuard)
@Controller('api/users')
export class UserController extends ApiController<UserDocument> {
  protected logger = new Logger(UserController.name);

  private userService: UserService;

  private authService: AuthService;

  constructor(
    @Inject(UserService) userService: UserService,
    @Inject(AuthService) authService: AuthService,
  ) {
    super({ baseService: userService });
    this.userService = userService;
    this.authService = authService;
  }

  @Get()
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<UserDocument>> {
    return super.getList(query, user);
  }

  @ApiResponse({ type: UserModel })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<SingleResult<UserDocument>> {
    return super.getOne(id);
  }

  @Post()
  async create(
    @Body() body: RawUserDocument,
  ): Promise<SingleResult<UserDocument>> {
    body.password = this.authService.encodePass(body.password || '123456789');
    return super.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: RawUserDocument,
  ): Promise<SingleResult<UserDocument>> {
    return super.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<SingleResult<UserDocument>> {
    return super.delete(id);
  }

  @Delete()
  async deleteBunch(
    @Body() body: { ids: Array<string> },
  ): Promise<Array<string>> {
    return super.deleteBunch(body);
  }
}
