import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { organizationProvider } from './organizations.provider';

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationsService, ...organizationProvider],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
