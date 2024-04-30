import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './utils/env.validator';
import { DatabaseModule } from './database/database.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { StoreCategoryModule } from './store-category/store-category.module';
import { StoreItemModule } from './store-item/store-item.module';
import { StoreItemImageModule } from './store-item-image/store-item-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    DatabaseModule,
    HealthCheckModule,
    StoreCategoryModule,
    StoreItemModule,
    StoreItemImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
