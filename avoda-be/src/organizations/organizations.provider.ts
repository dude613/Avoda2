import { DataSource } from 'typeorm';

import {
  DATA_SOURCE,
  ORGANIZATIONS_MEMBERS_REPOSITORY,
  ORGANIZATIONS_REPOSITORY,
  PERMISSIONS_REPOSITORY,
  TIME_LOG_REPOSITORY,
} from '@/shared/constants/database.constants';

import { Organization } from '@/entities/organization.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';
import { PermissionEntity } from '@/entities/permissions.entity';
import { TimeLog } from '@/entities/time-log.entity';

export const organizationProvider = [
  {
    provide: ORGANIZATIONS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Organization),
    inject: [DATA_SOURCE],
  },
  {
    provide: ORGANIZATIONS_MEMBERS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(OrganizationMembers),
    inject: [DATA_SOURCE],
  },
  {
    provide: PERMISSIONS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PermissionEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: TIME_LOG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TimeLog),
    inject: [DATA_SOURCE],
  },
];
