export enum USER_PERMISSIONS {
  READ_TASK = 'READ:TASK',
  WRITE_TASK = 'WRITE:UPDATE',
  DELETE_TASK = 'DELETE:TASK',
  UPDATE_TASK = 'UPDATE:TASK',

  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  CREATE_ORGANIZATION = 'create:organization',
  READ_ORGANIZATION = 'read:organization',
  UPDATE_ORGANIZATION = 'update:organization',
  DELETE_ORGANIZATION = 'delete:organization',
  INVITE_USER = 'invite:user',
  REMOVE_USER = 'remove:user',
  MANAGE_ROLES = 'manage:roles',

  ROOT_PERMISSION = 'root:permissions',
}
