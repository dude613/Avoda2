import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import { TransformInterceptor } from '@/interceptors/transform.interceptor';
import { ValidationPipe } from '@/pipes/validation.pipe';

import { GlobalExceptionsFilter } from '@/filters/global-exception.filter';

import { Environment, validate } from '@/shared/environment.config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
