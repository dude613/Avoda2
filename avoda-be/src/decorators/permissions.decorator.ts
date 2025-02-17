import { SetMetadata } from '@nestjs/common';
import { MEMBER_PERMISSIONS } from '@/enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: MEMBER_PERMISSIONS[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
