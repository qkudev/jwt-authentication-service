import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { app as config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
}

bootstrap();
