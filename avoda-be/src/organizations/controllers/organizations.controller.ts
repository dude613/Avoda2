import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/auth/access-token.guard';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { User } from '@/entities/user.entity';

import { OrganizationsService } from '../services/organizations.service';

import { CreateOrganizationDTO } from '../dto/create-organization.dto';
import { UpdateOrganizationDTO } from '../dto/update-organization.dto';

@Controller('organizations')
@UseGuards(AuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

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
  createOrganization(
    @CurrentUser() user: Partial<User>,
    @Body() { name }: CreateOrganizationDTO
  ) {
    return this.organizationService.createOrganization(name, user);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.UPDATE_ORGANIZATION
  )
  updateOrganization(
    @Param('id') id: string,
    @Body() data: UpdateOrganizationDTO
  ) {
    return this.organizationService.updateOrganization(data, id);
  }
}
