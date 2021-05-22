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
} from '../services/RotatorService';

@ApiTags('rotator')
@UseGuards(UserAuthGuard)
@Controller('api/rotator')
export class RotatorController extends ApiController<RotatorItemDocument> {
  protected logger = new Logger(RotatorController.name);

  rotatorService: RotatorService;

  constructor(@Inject(RotatorService) rotatorService: RotatorService) {
    super({ baseService: rotatorService });
    this.rotatorService = rotatorService;
  }

  @Get()
  async getList(
    @Query() query,
    @User() user: UserData,
  ): Promise<ListResult<RotatorItemDocument>> {
    return super.getList(query, user);
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
