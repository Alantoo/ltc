import { Inject, Controller, Logger } from '@nestjs/common';
import { ApiController } from './ApiController';
import { UserService, UserDocument } from '../services/UserService';

@Controller('api/users')
export class UserController extends ApiController<UserDocument> {
  protected logger = new Logger(UserController.name);

  userService: UserService;

  constructor(@Inject(UserService) userService: UserService) {
    super({ baseService: userService });
    this.userService = userService;
  }
}
