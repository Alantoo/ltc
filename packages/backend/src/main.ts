import { NestFactory } from '@nestjs/core';
import { MainModule } from './MainModule';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { cors: true });
  console.log('PORT - ' + process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
