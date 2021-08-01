import { Inject, Injectable } from '@nestjs/common';
import { DalService, ListQuery, ListResult } from './DalService';
import { UserDal, UserDocument, RawUserDocument } from '../dals/UserDal';
import { UserData } from './AuthService';

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

  async getComplexList(
    query?: ListQuery,
    user?: UserData,
  ): Promise<ListResult<UserDocument>> {
    const { filter, range, sort } = query || {};
    await this._beforeListFilter(filter, user);
    await this._beforeListRange(range, user);
    await this._beforeListSort(sort, user);
    const [data, total] = await Promise.all([
      this.userDal.getComplexList({ filter, range, sort }),
      this.userDal.getComplexCount({ filter, range, sort }),
    ]);
    return { data, total };
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

  async updateBalance(id: string, newBalance: number): Promise<void> {
    return this.userDal.updateBalance(id, newBalance);
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
