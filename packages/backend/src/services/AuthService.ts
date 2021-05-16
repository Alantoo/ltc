import {
  Injectable,
  createParamDecorator,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { hashSync } from 'bcrypt';
import { UserService, RawUserDocument } from './UserService';
import { UserTokenDal } from '../dals/UserTokenDal';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {}

export type JwtPayload = {
  id: string;
  email: string;
  roles: string[];
};

export type LoginInfo = {
  token: string;
  expiresIn: string;
};

export type RefreshInfo = {
  tokenId: string;
  tokenExpires: number;
};

export const User = createParamDecorator((data, req) => {
  return req.user;
});

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
    pass: string,
  ): Promise<{
    loginInfo: LoginInfo;
    refreshInfo: RefreshInfo;
  }> {
    const existedUser = await this.userService.findByEmail(email);
    if (existedUser) {
      throw new BadRequestException('User already exist');
    }
    const newUser = await this.userService.create(
      {
        email,
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

  private encodePass(rawPass: string): string {
    // return hashSync(rawPass, 10);
    return rawPass;
  }

  private createLoginInfo(user: RawUserDocument, token: string): LoginInfo {
    const expiresIn = '' + parseInt(process.env.JWT_EXPIRESIN, 10) * 1000;
    return {
      expiresIn,
      token,
    };
  }

  private createToken({ id, email }: RawUserDocument): string {
    const user: JwtPayload = { id, email, roles: [] };
    return this.jwtService.sign(user);
  }
}
