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
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        synchronize: true,
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
