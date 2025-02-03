import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { PERMISSIONS_KEY } from '@/decorators/require-permissions.decorator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';
import { PERMISSIONS_REPOSITORY } from '@/shared/constants/database.constants';

import { PermissionEntity } from '@/entities/permissions.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly permissionsRepository: Repository<PermissionEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      USER_PERMISSIONS[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // If no permissions are required, allow access
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const orgId = request.params['id'];
    const user = request['user'];

    // Ensure user exists in request and orgId is provided
    if (!user || !orgId) return false;

    // Fetch the user's permissions for the organization
    const orgMember = await this.getPermissions(user.id, orgId);

    // If no org member found or no permissions, deny access
    if (orgMember && !orgMember.length) return false;

    const permissionArray = orgMember.map(
      (p: { permissions: string }) => p.permissions,
    );

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some((permission) =>
      permissionArray.includes(permission),
    );

    return hasPermission;
  }

  private async getPermissions(userId: string, orgId: string) {
    return this.permissionsRepository
      .createQueryBuilder('permission')
      .innerJoin('permission.member', 'member')
      .where('member.user.id = :userId', { userId })
      .andWhere('member.organization.id = :organizationId', {
        organizationId: orgId,
      })
      .select('permission.permission permissions')
      .getRawMany();
  }
}
