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
import { Request, Response, NextFunction } from 'express';
import { AppController } from './controllers/AppController';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {

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
  ],
  controllers: [AppController],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.ADMIN_PASS) {
      consumer.apply(BasicAuthMiddleware).forRoutes('/');
    }
  }
}
