import { NestFactory } from '@nestjs/core';
import { MainModule } from './MainModule';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { cors: true });
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
