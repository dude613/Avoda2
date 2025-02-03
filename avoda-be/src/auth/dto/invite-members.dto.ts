import { IsArray, IsEmail } from 'class-validator';

export class InviteMembersDTO {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}
