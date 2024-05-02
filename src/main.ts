import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { HEALTH_CHECK_PACKAGE_NAME } from './health-check/health-check.pb';
import { STORE_ITEM_IMAGE_PACKAGE_NAME } from './store-item-image/store-item-image.pb';
import { STORE_CATEGORY_PACKAGE_NAME } from './store-category/store-category.pb';
import { STORE_ITEM_PACKAGE_NAME } from './store-item/store-item.pb';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('TRANSPORT_PORT');
  const HOST = configService.get<string>('TRANSPORT_HOST');
  const URL = `${HOST}:${PORT}`;
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: [
        HEALTH_CHECK_PACKAGE_NAME,
        STORE_CATEGORY_PACKAGE_NAME,
        STORE_ITEM_PACKAGE_NAME,
        STORE_ITEM_IMAGE_PACKAGE_NAME,
      ],
      protoPath: [
        join(__dirname, '../proto/health-check.proto'),
        join(__dirname, '../proto/store-category.proto'),
        join(__dirname, '../proto/store-item.proto'),
        join(__dirname, '../proto/store-item-image.proto'),
      ],
      url: URL,
    },
  });
  await app.startAllMicroservices();
  logger.log('Store microservice is running on ' + URL);
}
bootstrap();
