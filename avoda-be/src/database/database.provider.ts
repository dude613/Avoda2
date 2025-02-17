import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { DATA_SOURCE } from '@/shared/constants/database.constants';
import { Environment } from '@/shared/environment.config';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host:
          config.get<string>('NODE_ENV') === Environment.STAGING
            ? config.get<string>('DB_STAGING_HOST')
            : 'localhost',
        port: parseInt(
          config.get<string>('NODE_ENV') === Environment.STAGING
            ? config.get<string>('DB_PORT_STAGING')
            : config.get<string>('DB_PORT')
        ),
        username: config.get<string>('DB_USERNAME'),
        password:
          config.get<string>('NODE_ENV') === Environment.STAGING
            ? config.get<string>('DB_PASSWORD_STAGING')
            : config.get<string>('DB_PASSWORD'),
        database:
          config.get<string>('NODE_ENV') === Environment.STAGING
            ? config.get<string>('DB_NAME_STAGING')
            : config.get<string>('DB_NAME'),
        synchronize: config.get<string>('NODE_ENV') !== Environment.PRODUCTION,
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        migrationsRun: true,
        migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
        logging: true,
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
