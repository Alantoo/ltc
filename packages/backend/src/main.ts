import { join } from 'path';
import { readFileSync } from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
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

const SSL_PATH = process.env.SSL_PATH;

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (exception && !exception.message.startsWith('Cannot GET')) {
      response.status(status).json({
        message: exception.message,
        statusCode: status,
      });
      return;
    }

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
      }
      response.sendFile(join(__dirname, '../client', 'index.html'));
    }
  }
}

async function bootstrap() {
  let httpsOptions = undefined;
  if (process.env.NODE_ENV === 'production') {
    httpsOptions = {
      key: readFileSync(`${SSL_PATH}/privkey.pem`),
      cert: readFileSync(`${SSL_PATH}/cert.pem`),
      ca: readFileSync(`${SSL_PATH}/chain.pem`),
    };
  }
  const server = express();
  const app = await NestFactory.create(MainModule, new ExpressAdapter(server), {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('LTC REST API')
    // .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  console.log('PORT - ' + process.env.PORT);
  console.log('PORT_HTTPS - ' + process.env.PORT_HTTPS);
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

  await app.init();

  http.createServer(server).listen(process.env.PORT);
  https.createServer(httpsOptions, server).listen(process.env.PORT_HTTPS);

  // await app.listen(process.env.PORT);
}
bootstrap();
