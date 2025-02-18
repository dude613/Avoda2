import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/auth/access-token.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { MemberService } from '../services/members.service';

@Controller('organizations/:id/members')
@UseGuards(AuthGuard, PermissionsGuard)
export class MembersController {
  constructor(private readonly orgMembersService: MemberService) {}

  @Get()
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.READ_ORGANIZATION
  )
  getMembers(@Param('id') id: string) {
    return this.orgMembersService.getMembers(id);
  }

  @Get('/profile')
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.READ_ORGANIZATION
  )
  getMemberProfile(
    @Param('id') id: string,
    @Param(':memberId') memberId: string
  ) {
    return this.orgMembersService.getMemberProfile(memberId, id);
  }

  @Delete('/:memberId')
  @RequirePermissions(
    USER_PERMISSIONS.ROOT_PERMISSION,
    USER_PERMISSIONS.DELETE_USER
  )
  removeMemberFromOrganization(
    @Param('id') id: string,
    @Param('memberId') memberId: string
  ) {
    return this.orgMembersService.removeMemberFromOrganization(memberId, id);
  }
}
