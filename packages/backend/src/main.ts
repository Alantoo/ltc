import { join } from 'path';
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

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    if (request.url.startsWith('/admin')) {
      response.sendFile(join(__dirname, '../admin', 'index.html'));
    } else {
      response.sendFile(join(__dirname, '../client', 'index.html'));
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { cors: true });

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

  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
