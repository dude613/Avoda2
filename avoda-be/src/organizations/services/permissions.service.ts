import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PermissionEntity } from '@/entities/permissions.entity';
import { PERMISSIONS_REPOSITORY } from '@/shared/constants/database.constants';

import { UpdatePermissionsDTO } from '../dto/update-permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsEntity: Repository<PermissionEntity>
  ) {}

  async updatePermissions(data: UpdatePermissionsDTO) {
    const permissions = data.permissions.map((permission) => {
      return this.permissionsEntity.create({
        member: { id: data.id },
        permission,
      });
    });

    await this.permissionsEntity.save(permissions);

    return 'Permissions granted successfully';
  }
}
