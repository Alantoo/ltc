import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import { UserDal, UserDocument, RawUserDocument } from '../dals/UserDal';

export { RawUserDocument, UserDocument, User } from '../dals/UserDal';

@Injectable()
export class UserService extends DalService<UserDocument> {
  userDal: UserDal;

  constructor(@Inject(UserDal) userDal: UserDal) {
    super({ baseDal: userDal });
    this.userDal = userDal;
  }

  async findByEmail(email: string): Promise<RawUserDocument | undefined> {
    return this.userDal.findByEmail(email);
  }

  async findByName(name: string): Promise<RawUserDocument | undefined> {
    return this.userDal.findByName(name);
  }
}
