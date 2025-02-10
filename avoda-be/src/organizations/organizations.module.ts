import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { UserService } from '@/users/users.service';
import { userProviders } from '@/users/users.provider';
import { organizationProvider } from './organizations.provider';

import { OrganizationsService } from './services/organizations.service';
import { PermissionsService } from './services/permissions.service';
import { MemberService } from './services/members.service';

import { OrganizationsController } from './controllers/organizations.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { MembersController } from './controllers/members.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    OrganizationsService,
    UserService,
    PermissionsService,
    MemberService,
    ...organizationProvider,
    ...userProviders,
  ],
  controllers: [
    OrganizationsController,
    PermissionsController,
    MembersController,
  ],
})
export class OrganizationsModule {}
