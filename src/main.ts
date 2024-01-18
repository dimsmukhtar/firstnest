import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  ); // ini kode untuk menerapkan validation dari class-validator, kalau mau validate jika ada req.body yang out of context atau tidak di deklarasikan di dto, bisa dengan object di paramnya dan whitelist: true
  await app.listen(3000);
}
bootstrap();
