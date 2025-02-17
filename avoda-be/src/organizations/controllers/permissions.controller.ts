import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/auth/access-token.guard';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { PermissionsService } from '../services/permissions.service';
import { UpdatePermissionsDTO } from '../dto/update-permissions.dto';

@Controller('organizations/:id/permissions')
@UseGuards(AuthGuard, PermissionsGuard)
@RequirePermissions(
  USER_PERMISSIONS.ROOT_PERMISSION,
  USER_PERMISSIONS.UPDATE_USER
)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  updatePermissions(@Body() data: UpdatePermissionsDTO) {
    return this.permissionsService.updatePermissions(data);
  }
}
