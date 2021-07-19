import {
  Injectable,
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
  mixin,
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

export const roles = {
  ADMIN: 'admins',
};

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {}

export function AuthRoles(ruleRoles: string[]) {
  return mixin(
    class RolesAuth extends AuthGuard('jwt') {
      protected readonly roles = ruleRoles;
      handleRequest(err, user, info, context) {
        if (err || !user) {
          throw err || new UnauthorizedException();
        }

        const userRoles = [];
        if (user.isAdmin) {
          userRoles.push(roles.ADMIN);
        }

        if (this.roles.length === 0) {
          return user;
        }

        if (!this.roles.some((s) => userRoles.includes(s))) {
          throw new UnauthorizedException(
            `User does not meet one of the required roles (${this.roles.join(
              ',',
            )})`,
          );
        }
        return user;
      }
    },
  );
}

export type UserData =
  | undefined
  | (RawUserDocument & {
      isAdmin: boolean;
    });

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RawUserDocument = request.user;
    const proxy: UserData = {
      ...user,
    };
    return proxy; // || { id: '000000000000000000000000' };
  },
);

export type JwtPayload = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
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
    referUsername?: string,
  ): Promise<{
    loginInfo: LoginInfo;
    refreshInfo: RefreshInfo;
  }> {
    email = (email || '').toLowerCase();
    name = (name || '').toLowerCase();
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!name) {
      throw new BadRequestException('Name is required');
    }
    if (!this.userService.isUsernameValid(name)) {
      throw new BadRequestException('Name is invalid, use only "a-z0-9_-"');
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
    const referUser = await this.userService.findByName(referUsername);
    const newUser = await this.userService.create(
      {
        email,
        name,
        password: this.encodePass(pass),
        refer: referUser ? referUser.id : undefined,
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
    if (user && user.isBlocked) {
      throw new BadRequestException('User is blocked');
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

    if (user && user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
    }

    const token = this.createToken(user);
    return this.createLoginInfo(user, token);
  }

  async validateUser({ email }: JwtPayload): Promise<RawUserDocument | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    if (user && user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
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

  async checkVerificationCode(code?: string): Promise<RawUserDocument> {
    if (!code) {
      return;
    }
    let user = await this.userService.findByCode(code);
    if (user) {
      user = await this.userService.updateInternal(user.id, {
        isVerified: true,
        code: '',
      });
    }
    return user;
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
    const { id, email, name, isAdmin, isVerified } = user;
    const payload: JwtPayload = { id, email, name, isAdmin, isVerified };
    return this.jwtService.sign(payload);
  }
}
