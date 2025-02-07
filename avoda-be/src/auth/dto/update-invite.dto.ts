import { INVITE_STATUS } from '@/shared/constants/invite-status.constants';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateInviteDTO {
  @IsString()
  @IsEnum(INVITE_STATUS)
  @IsNotEmpty()
  status: INVITE_STATUS;

  @IsString()
  @IsNotEmpty()
  token: string;
}
