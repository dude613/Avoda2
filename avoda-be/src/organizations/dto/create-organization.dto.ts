import { IsString, MinLength } from 'class-validator';

export class CreateOrganizationDTO {
  @IsString()
  @MinLength(5)
  name: string;
}
