import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainModule } from './MainModule';

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
  await app.listen(process.env.PORT);
}
bootstrap();
