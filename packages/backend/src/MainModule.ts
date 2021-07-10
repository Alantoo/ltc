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
import {
  RotatorItemDal,
  RotatorItem,
  RotatorItemSchema,
} from './dals/RotatorItemDal';
import {
  ItemSelectDal,
  ItemSelect,
  ItemSelectSchema,
} from './dals/ItemSelectDal';
import { UserService } from './services/UserService';
import { ListService } from './services/ListService';
import { RotatorService } from './services/RotatorService';
import { ItemSelectService } from './services/ItemSelectService';
import { AuthService } from './services/AuthService';
import { JwtStrategy } from './services/JwtStrategy';
import { EmailService } from './services/EmailService';
import { PaymentService } from './services/PaymentService';
import { UserController } from './controllers/UserController';
import { ListController } from './controllers/ListController';
import { RotatorController } from './controllers/RotatorController';
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

@Injectable()
export class CoinbaseWebhookMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.setEncoding('utf8');

    let data = '';

    req.on('data', function (chunk) {
      data += chunk;
    });

    req.on('error', function (chunk) {
      console.error(chunk);
    });

    req.on('end', function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.rawBody = data;

      next();
    });
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
      { name: RotatorItem.name, schema: RotatorItemSchema },
      { name: ItemSelect.name, schema: ItemSelectSchema },
    ]),
  ],
  controllers: [
    AuthController,
    UserController,
    ListController,
    RotatorController,
  ],
  providers: [
    UserDal,
    UserTokenDal,
    ListDal,
    RotatorItemDal,
    ItemSelectDal,
    UserService,
    ListService,
    RotatorService,
    ItemSelectService,
    AuthService,
    EmailService,
    PaymentService,
    JwtStrategy,
  ],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('/');
    //consumer.apply(CoinbaseWebhookMiddleware).forRoutes('/api/rotator/webhook');
  }
}
