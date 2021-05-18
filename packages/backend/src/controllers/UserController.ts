import {
  Inject,
  Controller,
  UseGuards,
  Logger,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiController, ErrorResult } from './ApiController';
import { UserAuthGuard } from '../services/AuthService';
import { ListResult, SingleResult } from '../services/DalService';
import {
  User,
  UserService,
  UserDocument,
  RawUserDocument,
} from '../services/UserService';

@ApiTags('users')
@UseGuards(UserAuthGuard)
@Controller('api/users')
export class UserController extends ApiController<UserDocument> {
  protected logger = new Logger(UserController.name);

  userService: UserService;

  constructor(@Inject(UserService) userService: UserService) {
    super({ baseService: userService });
    this.userService = userService;
  }

  @Get()
  async getList(
    @Query() query,
  ): Promise<ListResult<UserDocument> | ErrorResult> {
    return super.getList(query);
  }

  @ApiResponse({ type: User })
  @Get(':id')
  async getOne(
    @Param('id') id: string,
  ): Promise<SingleResult<UserDocument> | ErrorResult> {
    return super.getOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: RawUserDocument,
  ): Promise<SingleResult<UserDocument> | ErrorResult> {
    return super.update(id, body);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<SingleResult<UserDocument> | ErrorResult> {
    return super.delete(id);
  }

  @Delete()
  async deleteBunch(
    @Body() body: { ids: Array<string> },
  ): Promise<Array<string> | ErrorResult> {
    return super.deleteBunch(body);
  }
}
