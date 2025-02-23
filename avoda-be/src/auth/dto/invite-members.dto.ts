import { ArrayNotEmpty, IsArray } from 'class-validator';

export class InviteMembersDTO {
  @IsArray()
  @ArrayNotEmpty()
  emails: string[];
}
