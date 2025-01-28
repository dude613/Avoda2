import { DataSource } from 'typeorm';

import {
  DATA_SOURCE,
  ORGANIZATIONS_REPOSITORY,
} from '@/shared/constants/database.constants';
import { Organization } from '@/entities/organization.entity';

export const organizationProvider = [
  {
    provide: ORGANIZATIONS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Organization),
    inject: [DATA_SOURCE],
  },
];
