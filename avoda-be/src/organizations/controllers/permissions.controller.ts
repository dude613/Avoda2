import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { RevokePermissionsDTO } from '@/shared/dtos/revoke-permission.dto';

import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { PermissionsService } from '../services/permissions.service';
import { UpdatePermissionsDTO } from '../dto/update-permissions.dto';

@Controller('organizations/:id/permissions')
@UseGuards(PermissionsGuard)
@RequirePermissions(
  USER_PERMISSIONS.ROOT_PERMISSION,
  USER_PERMISSIONS.UPDATE_USER
)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('/')
  updatePermissions(@Body() data: UpdatePermissionsDTO) {
    return this.permissionsService.updatePermissions(data);
  }

  @Post('/revoke')
  revokePermissions(@Body() body: RevokePermissionsDTO) {
    return this.permissionsService.revokePermission(body.id, body.memberId);
  }

  @Get('/:memberId')
  getPermissions(@Param('memberId') memberId: string) {
    return this.permissionsService.getPermissions(memberId);
  }
}
