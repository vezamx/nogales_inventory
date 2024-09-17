import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders:
      //'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      '*'
  });
  await app.listen(process.env.PORT || 4242);
}
bootstrap();
