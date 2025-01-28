import { DataSource } from 'typeorm';

import {
  DATA_SOURCE,
  ORGANIZATIONS_MEMBERS_REPOSITORY,
  ORGANIZATIONS_REPOSITORY,
} from '@/shared/constants/database.constants';

import { Organization } from '@/entities/organization.entity';
import { OrgMember } from '@/entities/org-member.entity';

export const organizationProvider = [
  {
    provide: ORGANIZATIONS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Organization),
    inject: [DATA_SOURCE],
  },
  {
    provide: ORGANIZATIONS_MEMBERS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrgMember),
    inject: [DATA_SOURCE],
  },
];
