import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';

import { OrgMember } from '@/entities/org-member.entity';
import { PERMISSIONS_KEY } from '@/decorators/permissions.decorator';

import { MEMBER_PERMISSIONS } from '@/enums/permissions.enum';
import { ORGANIZATIONS_MEMBERS_REPOSITORY } from '@/shared/constants/database.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ORGANIZATIONS_MEMBERS_REPOSITORY)
    private readonly org_member: Repository<OrgMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<
      MEMBER_PERMISSIONS[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // If no permissions are required, allow access
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // Ensure user exists in request
    if (!user) return false;

    const orgMember = await this.org_member.findOneBy({
      user_id: user.id,
    });

    // If no org member found
    if (!orgMember) return false;

    // Check if user has any of the required permissions
    const hasPermission = requiredRoles.some((permission) =>
      orgMember.permissions.split(',').includes(MEMBER_PERMISSIONS[permission]),
    );

    return hasPermission;
  }
}
