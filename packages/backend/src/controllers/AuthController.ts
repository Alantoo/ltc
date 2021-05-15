import {
  Controller,
  Get,
  Post,
  Logger,
  UseGuards,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService, LoginInfo, RefreshInfo } from '../services/AuthService';

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
  ): Promise<LoginInfo> {
    const { refreshInfo, loginInfo } = await this.authService.registerUser(
      body.email,
      body.password,
    );
    this.setRefreshTokenCookie(refreshInfo, response);
    return loginInfo;
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; rememberMe: boolean },
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginInfo> {
    const { refreshInfo, loginInfo } = await this.authService.loginUSer(
      body.email,
      body.password,
      body.rememberMe,
    );
    this.setRefreshTokenCookie(refreshInfo, response);
    return loginInfo;
  }

  @Get('refresh')
  async refresh(@Req() request: Request): Promise<LoginInfo> {
    const refreshToken = this.getRefreshTokenCookie(request);
    return this.authService.refreshToken(refreshToken);
  }

  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const refreshToken = this.getRefreshTokenCookie(request);
    this.setRefreshTokenCookie(
      {
        tokenId: null,
        tokenExpires: new Date(new Date().getTime() - 1),
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

  private getRefreshTokenCookie(@Req() request: Request): string {
    return request.signedCookies['refreshToken'];
  }

  private setRefreshTokenCookie(
    refreshInfo: RefreshInfo,
    @Res() response: Response,
  ): void {
    // store refresh token
    response.cookie('refreshToken', refreshInfo.tokenId, {
      expires: refreshInfo.tokenExpires,
      httpOnly: true,
      secure: false,
      signed: true,
    });
  }
}
