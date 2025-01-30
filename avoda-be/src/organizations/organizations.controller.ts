import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { User } from '@/entities/user.entity';

import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Get('/:id')
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.READ_ORGANIZATION,
  )
  @UseGuards(PermissionsGuard)
  getOrganizationById(@Param('id') id: string) {
    return this.organizationService.getOrganizationById(id);
  }

  @Get('/me/organizations')
  getYourOrganizations(@CurrentUser() user: Partial<User>) {
    return this.organizationService.getYourOrganizations(user);
  }
}
