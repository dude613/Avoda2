import { SetMetadata } from '@nestjs/common';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: USER_PERMISSIONS[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
