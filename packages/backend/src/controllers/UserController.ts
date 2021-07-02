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
import { AuthService } from '../services/AuthService';

@ApiTags('users')
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
  @UseGuards(AuthRoles([roles.ADMIN]))
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<UserDocument>> {
    return super.getList(query, user);
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
    if (!user.isAdmin() && user.id.toString() !== obj.id.toString()) {
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
    if (!user.isAdmin() && user.id.toString() !== obj.id.toString()) {
      throw new UnauthorizedException();
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
    if (!user.isAdmin() && user.id.toString() !== obj.id.toString()) {
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
