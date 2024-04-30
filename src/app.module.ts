import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './utils/env.validator';
import { DatabaseModule } from './database/database.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    DatabaseModule,
    HealthCheckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
