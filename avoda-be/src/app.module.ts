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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize:
          configService.get<string>('NODE_ENV') !== Environment.PRODUCTION,
        entities: [`${__dirname}/**/*.entity.ts`],
        migrationsRun:
          configService.get<string>('NODE_ENV') === Environment.PRODUCTION,
        logging:
          configService.get<string>('NODE_ENV') !== Environment.PRODUCTION,
        autoLoadEntities: true,
        options: {
          connectTimeout: parseInt(
            configService.get<string>('DB_CONNECTION_TIMEOUT'),
          ),
        },
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
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
