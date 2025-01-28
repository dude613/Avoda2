import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import { TransformInterceptor } from '@/interceptors/transform.interceptor';
import { ValidationPipe } from '@/pipes/validation.pipe';

import { GlobalExceptionsFilter } from '@/filters/global-exception.filter';

import { validate } from '@/shared/environment.config';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
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
