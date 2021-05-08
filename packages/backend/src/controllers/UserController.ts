import { Inject, Controller, Get, Req, Logger } from '@nestjs/common';
import { ApiController } from './ApiController';
import { UserDocument } from '../dals/schemas/User';
import { UserService } from '../services/UserService';

@Controller('api/users')
export class UserController extends ApiController<UserDocument> {
  protected logger = new Logger(UserController.name);

  userService: UserService;

  constructor(@Inject(UserService) userService: UserService) {
    super({ baseService: userService });
    this.userService = userService;
  }
}
