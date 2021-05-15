import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, JwtPayload } from './AuthService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  authService: AuthService;

  constructor(authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.authService = authService;
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateUser(payload);
  }
}
