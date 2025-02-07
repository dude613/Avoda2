import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/auth/access-token.guard';

import { User } from '@/entities/user.entity';

import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { OrganizationsService } from './services/organizations.service';
import { PermissionsService } from './services/permissions.service';
import { MemberService } from './services/members.service';

import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { UpdatePermissionsDTO } from './dto/update-permissions.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationService: OrganizationsService,
    private readonly permissionsService: PermissionsService,
    private readonly orgMembersService: MemberService
  ) {}

  @Get('/:id')
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.READ_ORGANIZATION
  )
  @UseGuards(PermissionsGuard)
  getOrganizationById(@Param('id') id: string) {
    return this.organizationService.getOrganizationById(id);
  }

  @Get('/me/organizations')
  getYourOrganizations(@CurrentUser() user: Partial<User>) {
    return this.organizationService.getYourOrganizations(user);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  createOrganization(
    @CurrentUser() user: Partial<User>,
    @Body() { name }: CreateOrganizationDTO
  ) {
    return this.organizationService.createOrganization(name, user);
  }

  @Post(':id/permissions')
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.UPDATE_USER
  )
  updatePermissions(@Body() data: UpdatePermissionsDTO) {
    return this.permissionsService.updatePermissions(data);
  }

  @Get(':id/members')
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.READ_ORGANIZATION
  )
  getMembers(@Param('id') id: string) {
    return this.orgMembersService.getMembers(id);
  }
}
