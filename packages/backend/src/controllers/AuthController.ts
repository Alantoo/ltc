import {
  Controller,
  Get,
  Post,
  Logger,
  UseGuards,
  Body,
  Req,
  Res,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  AuthService,
  AuthRoles,
  LoginInfo,
  RefreshInfo,
  UserData,
  User,
} from '../services/AuthService';
import { EmailService } from '../services/EmailService';

function getHost(req: Request, forUI = false) {
  if (process.env.NODE_ENV === 'production') {
    return req.headers.origin || process.env.HOST;
  }
  return forUI ? 'http://localhost:3002' : 'http://localhost:8282';
}

type LoginResult = {
  loginInfo: LoginInfo;
  refreshInfo: RefreshInfo;
};

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  authService: AuthService;
  emailService: EmailService;

  constructor(authService: AuthService, emailService: EmailService) {
    this.authService = authService;
    this.emailService = emailService;
  }

  @Post('register')
  async register(
    @Body() body: { email: string; name: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResult> {
    const result = await this.authService.registerUser(
      body.email,
      body.name,
      body.password,
    );
    this.setRefreshToken(result.refreshInfo, response);
    return result;
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; rememberMe: boolean },
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResult> {
    const result = await this.authService.loginUSer(
      body.email,
      body.password,
      body.rememberMe,
    );
    this.setRefreshToken(result.refreshInfo, response);
    return result;
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Query() query): Promise<LoginInfo> {
    const refreshToken = this.getRefreshToken(request) || query.token;
    return this.authService.refreshToken(refreshToken);
  }

  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query() query,
  ): Promise<void> {
    const refreshToken = this.getRefreshToken(request) || query.token;
    this.setRefreshToken(
      {
        tokenId: null,
        tokenExpires: new Date(new Date().getTime() - 1).getTime(),
      },
      response,
    );
    return this.authService.logout(refreshToken);
  }

  @Get('sendVerify')
  @UseGuards(AuthRoles([]))
  async sendVerify(
    @Req() request: Request,
    @User() user: UserData,
  ): Promise<void> {
    const host = getHost(request);
    const code = await this.authService.setVerificationCode(user);
    const url = `${host}/api/auth/verify/${code}`;
    await this.emailService.sendVerificationCode(url, user);
  }

  @Get('verify/:code')
  async verify(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Param('code') code: string,
  ): Promise<void> {
    const host = getHost(request, true);
    const url = `${host}/profile`;
    try {
      await this.authService.checkVerificationCode(code);
    } catch (e) {}
    response.redirect(url);
  }

  private getRefreshToken(@Req() request: Request): string {
    return request.signedCookies['refreshToken'];
  }

  private setRefreshToken(
    refreshInfo: RefreshInfo,
    @Res() response: Response,
  ): void {
    response.cookie('refreshToken', refreshInfo.tokenId, {
      expires: new Date(refreshInfo.tokenExpires),
      httpOnly: true,
      secure: false,
      signed: true,
    });
  }
}
