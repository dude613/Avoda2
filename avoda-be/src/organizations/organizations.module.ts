import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { UserService } from '@/users/users.service';
import { userProviders } from '@/users/users.provider';

import { OrganizationsService } from './services/organizations.service';
import { PermissionsService } from './services/permissions.service';
import { MemberService } from './services/members.service';

import { OrganizationsController } from './organizations.controller';
import { organizationProvider } from './organizations.provider';

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
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
