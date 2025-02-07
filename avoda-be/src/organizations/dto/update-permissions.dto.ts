import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_PERMISSIONS } from '@/enums/permissions.enum';

export class UpdatePermissionsDTO {
  @IsArray()
  @IsEnum(USER_PERMISSIONS, { each: true })
  @IsNotEmpty()
  permissions: Array<USER_PERMISSIONS>;

  @IsString()
  @IsNotEmpty()
  id: string;
}
