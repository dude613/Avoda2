import { DataSource } from 'typeorm';

import {
  DATA_SOURCE,
  INVITES_REPOSITORY,
} from '@/shared/constants/database.constants';

import { InvitesRepository } from '@/entities/invites.entity';

export const invitesProvider = [
  {
    provide: INVITES_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InvitesRepository),
    inject: [DATA_SOURCE],
  },
];
