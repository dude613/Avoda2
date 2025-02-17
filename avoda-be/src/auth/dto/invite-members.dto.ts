import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class InviteMembersDTO {
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  emails: string[];
}
