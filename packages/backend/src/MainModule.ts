import { join } from 'path';
import {
  Module,
  Injectable,
  NestModule,
  NestMiddleware,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as cookieParser from 'cookie-parser';
import { UserDal, User, UserSchema } from './dals/UserDal';
import { UserTokenDal, UserToken, UserTokenSchema } from './dals/UserTokenDal';
import { ListDal, List, ListSchema } from './dals/ListDal';
import { UserService } from './services/UserService';
import { ListService } from './services/ListService';
import { AuthService } from './services/AuthService';
import { JwtStrategy } from './services/JwtStrategy';
import { EmailService } from './services/EmailService';
import { UserController } from './controllers/UserController';
import { ListController } from './controllers/ListController';
import { AuthController } from './controllers/AuthController';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  useFn: RequestHandler;

  constructor() {
    this.useFn = cookieParser(process.env.COOKIE_SECRET);
  }

  use(req: Request, res: Response, next: NextFunction) {
    return this.useFn(req, res, next);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? './.env.production' : './.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './client'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './admin'),
      serveRoot: '/admin',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRESIN, 10) * 1000,
      },
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserToken.name, schema: UserTokenSchema },
      { name: List.name, schema: ListSchema },
    ]),
  ],
  controllers: [AuthController, UserController, ListController],
  providers: [
    UserDal,
    UserTokenDal,
    ListDal,
    UserService,
    ListService,
    AuthService,
    EmailService,
    JwtStrategy,
  ],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('/');
  }
}
