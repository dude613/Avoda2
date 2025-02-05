import { INVITE_STATUS } from '@/shared/constants/invite-status.constants';
import { IsEnum, IsString } from 'class-validator';

export class UpdateInviteDTO {
  @IsString()
  @IsEnum(INVITE_STATUS)
  status: INVITE_STATUS;

  @IsString()
  token: string;
}
