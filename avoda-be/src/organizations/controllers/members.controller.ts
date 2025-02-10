import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/auth/access-token.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { MemberService } from '../services/members.service';

@Controller('organizations/:id/members')
@UseGuards(AuthGuard, PermissionsGuard)
@RequirePermissions(
  USER_PERMISSIONS.ROOT_PERMISSION,
  USER_PERMISSIONS.READ_ORGANIZATION
)
export class MembersController {
  constructor(private readonly orgMembersService: MemberService) {}

  @Get()
  getMembers(@Param('id') id: string) {
    return this.orgMembersService.getMembers(id);
  }
}
