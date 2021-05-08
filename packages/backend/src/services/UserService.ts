import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import { UserDocument } from '../dals/schemas/User';
import { UserDal } from '../dals/UserDal';

@Injectable()
export class UserService extends DalService<UserDocument> {
  userDal: UserDal;

  constructor(@Inject(UserDal) userDal: UserDal) {
    super({ baseDal: userDal });
    this.userDal = userDal;
  }
}
