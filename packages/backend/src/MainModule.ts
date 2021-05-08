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
import { Request, Response, NextFunction } from 'express';
import { User, UserSchema } from './dals/schemas/User';
import { UserDal } from './dals/UserDal';
import { UserService } from './services/UserService';
import { UserController } from './controllers/UserController';
import { AppController } from './controllers/AppController';

@Injectable()
export class TestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
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
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, UserController],
  providers: [UserDal, UserService],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.ADMIN_PASS) {
      consumer.apply(TestMiddleware).forRoutes('/');
    }
  }
}
