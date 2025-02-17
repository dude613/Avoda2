import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  rate: number;
}
