import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { PermissionEntity } from '@/entities/permissions.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';

import {
  ORGANIZATIONS_MEMBERS_REPOSITORY,
  PERMISSIONS_REPOSITORY,
} from '@/shared/constants/database.constants';

import { UpdatePermissionsDTO } from '../dto/update-permissions.dto';
import { AppError } from '../../shared/appError.util';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsEntity: Repository<PermissionEntity>,
    @Inject(ORGANIZATIONS_MEMBERS_REPOSITORY)
    private readonly orgMemberEntity: Repository<OrganizationMembers>
  ) {}

  async updatePermissions(data: UpdatePermissionsDTO) {
    // find the member using the id provided
    const member = await this.orgMemberEntity.findOneBy({ id: data.id });

    if (!member) {
      throw new AppError(
        `No member found with this id : ${data.id}`,
        HttpStatus.BAD_REQUEST
      );
    }

    const existingPermissions = await this.permissionsEntity.find({
      where: { member: { id: member.id }, permission: In(data.permissions) },
      select: ['permission'], // Only fetch permission field
    });

    const existingPermissionsSet = new Set(
      existingPermissions.map((perm) => perm.permission)
    );

    // Filter out already assigned permissions
    const newPermissions = data.permissions.filter(
      (perm) => !existingPermissionsSet.has(perm)
    );

    if (!newPermissions.length) {
      throw new AppError(
        'Permission(s) already exists for this user',
        HttpStatus.BAD_REQUEST
      );
    }

    // create the permissions for the user
    const permissions = this.permissionsEntity.create(
      newPermissions.map((permission) => ({
        member: { id: member.id },
        permission,
      }))
    );

    await this.permissionsEntity.save(permissions);

    return 'Permission(s) granted successfully';
  }
}
