import { join } from 'path';
import { readFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import {
  Catch,
  NotFoundException,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainModule } from './MainModule';
import { UserService } from './services/UserService';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    if (request.url.startsWith('/admin')) {
      response.sendFile(join(__dirname, '../admin', 'index.html'));
    } else {
      const name = request.url.split('/')[1];
      let referUser;
      if (this.userService.isUsernameValid(name)) {
        referUser = await this.userService.findByName(name);
      }
      response.cookie('basename', '');
      if (name && referUser) {
        response.cookie('basename', name);
        response.sendFile(join(__dirname, '../client', 'index.html'));
      } else {
        response.redirect('/');
      }
    }
  }
}

async function bootstrap() {
  let httpsOptions = undefined;
  if (process.env.NODE_ENV === 'production') {
    httpsOptions = {
      key: readFileSync('./cert/privkey1.pem'),
      cert: readFileSync('./cert/cert1.pem'),
      ca: readFileSync('./cert/chain1.pem'),
    };
  }
  const app = await NestFactory.create(MainModule, {
    cors: true,
    httpsOptions,
  });

  const config = new DocumentBuilder()
    .setTitle('LTC REST API')
    // .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  console.log('PORT - ' + process.env.PORT);
  app.enableCors({
    origin: [
      'http://localhost:3003',
      'http://localhost:3002',
      'http://localhost:8282',
    ],
    credentials: true,
  });

  const appContext = await NestFactory.createApplicationContext(MainModule);

  app.useGlobalFilters(
    new NotFoundExceptionFilter(appContext.get(UserService)),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
