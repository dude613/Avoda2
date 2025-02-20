import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import { TransformInterceptor } from '@/interceptors/transform.interceptor';
import { ValidationPipe } from '@/pipes/validation.pipe';

import { GlobalExceptionsFilter } from '@/filters/global-exception.filter';
import { Environment, validate } from '@/shared/environment.config';

import { AuthGuard } from '@/auth/access-token.guard';
import { UsersModule } from '@/users/users.module';

import { OrganizationsModule } from '@/organizations/organizations.module';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    EmailModule,
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis:
          config.get<string>('NODE_ENV') === Environment.STAGING
            ? config.get<string>('REDIS_CONNECTION_URL')
            : {
                host: 'localhost',
                port: 6379,
              },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
