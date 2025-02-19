import { IsNotEmpty, IsString } from 'class-validator';

export class RevokePermissionsDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  memberId: string;
}
