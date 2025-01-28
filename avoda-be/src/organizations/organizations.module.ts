import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';

import { OrganizationsService } from './organizations.service';
import { organizationProvider } from './organizations.provider';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationsService, ...organizationProvider],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
