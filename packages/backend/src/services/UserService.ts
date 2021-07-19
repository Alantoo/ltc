import { Inject, Injectable } from '@nestjs/common';
import { DalService } from './DalService';
import { UserDal, UserDocument, RawUserDocument } from '../dals/UserDal';

export {
  RawUserDocument,
  UserDocument,
  User,
  UserCreateDto,
  UserUpdateDto,
} from '../dals/UserDal';

const reservedUsernames = ['admin', 'favicon.ico'];
const usernameRegExp = /^[a-zA-Z0-9-_]+$/;

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

  async findByCode(code: string): Promise<RawUserDocument | undefined> {
    return this.userDal.findByCode(code);
  }

  isUsernameValid(name): boolean {
    if (reservedUsernames.indexOf(name) !== -1) {
      return false;
    }
    if (name.startsWith('admin')) {
      return false;
    }
    return usernameRegExp.test(name);
  }
}
