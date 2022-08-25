import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
