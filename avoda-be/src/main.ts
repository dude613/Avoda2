import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { Environment } from '@/shared/environment.config';
import { Signals } from '@/shared/signals.enum';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.NODE_ENV !== Environment.PRODUCTION && '*',
      credentials: true,
      allowedHeaders: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  });

  // Add application version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (process.env.NODE_ENV === Environment.PRODUCTION) {
    // Enable security middleware
    app.use(helmet());
  }

  if (process.env.NODE_ENV !== Environment.PRODUCTION) {
    app.use(morgan('dev'));
  }

  await app.listen(process.env.PORT ?? 4000, async () => {
    new Logger('AppLogStarter').log(`App is running on: ${process.env.PORT}`);
  });

  process.on(Signals.UNHANDLED_REJECTION, async (reason: any) => {
    console.error(`Unhandled rejection, reason: ${reason.message}`);

    await app.close();
    process.exit(1);
  });

  process.on(Signals.SIGTERM, async () => {
    console.info('SIGTERM signal received. Shutting down...');

    await app.close();
    process.exit(0);
  });

  process.on(Signals.SIGINT, async (err: any) => {
    console.info('SIGINT signal received. Shutting down...');
    process.exit(err ? 1 : 0);
  });
}
bootstrap();
