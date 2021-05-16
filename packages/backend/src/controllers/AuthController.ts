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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService, LoginInfo, RefreshInfo } from '../services/AuthService';

type LoginResult = {
  loginInfo: LoginInfo;
  refreshInfo: RefreshInfo;
};

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResult> {
    const result = await this.authService.registerUser(
      body.email,
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

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  async test(): Promise<{
    data?: any;
    error?: Error;
  }> {
    try {
      return {
        data: 'ok',
      };
    } catch (error) {
      this.logger.error(`Test error: "${error.message}"`);
      return { error };
    }
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
