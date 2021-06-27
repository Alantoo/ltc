import {
  Injectable,
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { hashSync } from 'bcrypt';
import { UserService, RawUserDocument } from './UserService';
import { UserTokenDal } from '../dals/UserTokenDal';

const getCode = (size = 25): string => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {}

export type UserData =
  | undefined
  | (RawUserDocument & {
      isAdmin: () => boolean;
    });

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RawUserDocument = request.user;
    const isAdmin = user ? user.roles.includes('admin') : false;
    const proxy: UserData = {
      ...user,
      isAdmin() {
        return isAdmin;
      },
    };
    return proxy; // || { id: '000000000000000000000000' };
  },
);

export type JwtPayload = {
  id: string;
  email: string;
  roles: string[];
  isVerified: boolean;
};

export type LoginInfo = {
  token: string;
  expiresIn: string;
};

export type RefreshInfo = {
  tokenId: string;
  tokenExpires: number;
};

@Injectable()
export class AuthService {
  userService: UserService;
  userTokenDal: UserTokenDal;
  jwtService: JwtService;

  constructor(
    userService: UserService,
    userTokenDal: UserTokenDal,
    jwtService: JwtService,
  ) {
    this.userService = userService;
    this.userTokenDal = userTokenDal;
    this.jwtService = jwtService;
  }

  async registerUser(
    email: string,
    name: string,
    pass: string,
  ): Promise<{
    loginInfo: LoginInfo;
    refreshInfo: RefreshInfo;
  }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!name) {
      throw new BadRequestException('Name is required');
    }
    if (!pass) {
      throw new BadRequestException('Password is required');
    }
    const existedEmail = await this.userService.findByEmail(email);
    if (existedEmail) {
      throw new BadRequestException('Email already exist');
    }
    const existedName = await this.userService.findByName(name);
    if (existedName) {
      throw new BadRequestException('User name already exist');
    }
    const newUser = await this.userService.create(
      {
        email,
        name,
        password: this.encodePass(pass),
      },
      {},
    );

    const refreshInfo = await this.updateRefreshToken(newUser.id, false);

    const token = this.createToken(newUser);
    const loginInfo = this.createLoginInfo(newUser, token);
    return { loginInfo, refreshInfo };
  }

  async loginUSer(
    email: string,
    pass: string,
    rememberMe = false,
  ): Promise<{
    loginInfo: LoginInfo;
    refreshInfo: RefreshInfo;
  }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!pass) {
      throw new BadRequestException('Password is required');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user && user.password !== this.encodePass(pass)) {
      throw new BadRequestException('Wrong password');
    }

    const refreshInfo = await this.updateRefreshToken(user.id, rememberMe);

    const token = this.createToken(user);
    const loginInfo = this.createLoginInfo(user, token);
    return { loginInfo, refreshInfo };
  }

  async logout(refreshTokenId: string): Promise<void> {
    await this.userTokenDal.delete(refreshTokenId);
  }

  async refreshToken(refreshTokenId: string): Promise<LoginInfo> {
    const dbToken = await this.userTokenDal.getOne(refreshTokenId);

    if (!dbToken || !dbToken.id) {
      throw new BadRequestException('The refresh token is not valid');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (dbToken.validityTimestamp <= currentTimestamp) {
      await this.userTokenDal.delete(refreshTokenId);
      throw new BadRequestException('The refresh token is expired');
    }

    const user = await this.userService.getOne(dbToken.userId, {});

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createToken(user);
    return this.createLoginInfo(user, token);
  }

  async validateUser({ email }: JwtPayload): Promise<RawUserDocument | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async setVerificationCode(user: UserData): Promise<string> {
    if (user.isVerified) {
      return '';
    }
    const code = getCode();
    await this.userService.updateInternal(user.id, {
      code,
    });
    return code;
  }

  async checkVerificationCode(code?: string): Promise<void> {
    if (!code) {
      return;
    }
    const user = await this.userService.findByCode(code);
    if (user) {
      await this.userService.updateInternal(user.id, {
        isVerified: true,
        code: '',
      });
    }
  }

  encodePass(rawPass: string): string {
    return hashSync(rawPass, process.env.SALT);
  }

  private async updateRefreshToken(
    userId: string,
    rememberMe: boolean,
  ): Promise<RefreshInfo> {
    let refreshTokenId;
    const existingRefreshToken = await this.userTokenDal.getOneByUserId(userId);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (
      existingRefreshToken &&
      existingRefreshToken.validityTimestamp > currentTimestamp
    ) {
      refreshTokenId = existingRefreshToken.id;
    } else {
      // If there was already a refresh token for the user
      // but that this one was no longer valid
      // we erase it so we can create a new one.
      if (existingRefreshToken && existingRefreshToken.id) {
        await this.userTokenDal.delete(existingRefreshToken.id);
      }
      const newTokenData = {
        userId,
        rememberMe,
        validityTimestamp: rememberMe
          ? currentTimestamp +
            parseInt(process.env.JWT_REFRESH_REMEMBER_EXPIRESIN, 10)
          : currentTimestamp + parseInt(process.env.JWT_REFRESH_EXPIRESIN, 10),
      };

      let newRefreshToken;
      try {
        newRefreshToken = await this.userTokenDal.create(newTokenData);
        refreshTokenId = newRefreshToken.id.toString();
      } catch (err) {
        throw new BadRequestException('Error during refresh token creation');
      }
    }

    const delay = rememberMe
      ? parseInt(process.env.JWT_REFRESH_REMEMBER_EXPIRESIN, 10) * 1000
      : parseInt(process.env.JWT_REFRESH_EXPIRESIN, 10) * 1000;
    const tokenExpires = new Date(new Date().getTime() + delay).getTime();

    return { tokenId: refreshTokenId, tokenExpires };
  }

  private createLoginInfo(user: RawUserDocument, token: string): LoginInfo {
    const expiresIn = '' + parseInt(process.env.JWT_EXPIRESIN, 10) * 1000;
    return {
      expiresIn,
      token,
    };
  }

  private createToken(user: RawUserDocument): string {
    const { id, email, roles, isVerified } = user;
    const payload: JwtPayload = { id, email, roles, isVerified };
    return this.jwtService.sign(payload);
  }
}
