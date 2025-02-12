import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { UserService } from '@/users/users.service';
import { userProviders } from '@/users/users.provider';
import { organizationProvider } from './organizations.provider';

import { OrganizationsService } from './services/organizations.service';
import { PermissionsService } from './services/permissions.service';
import { MemberService } from './services/members.service';
import { TimeLogService } from './services/time-log.service';

import { OrganizationsController } from './controllers/organizations.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { MembersController } from './controllers/members.controller';
import { TimeLogController } from './controllers/time-log.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    OrganizationsService,
    UserService,
    PermissionsService,
    MemberService,
    TimeLogService,
    ...organizationProvider,
    ...userProviders,
  ],
  controllers: [
    OrganizationsController,
    PermissionsController,
    MembersController,
    TimeLogController,
  ],
})
export class OrganizationsModule {}
