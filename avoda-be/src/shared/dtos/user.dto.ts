import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';

export class UserDto {
  @IsString({ message: 'value must be of type string' })
  id: string;

  @IsString({ message: 'value must be of type string' })
  firstName: string;

  @IsString({ message: 'value must be of type string' })
  lastName: string;

  @IsString({ message: 'value must be of type string' })
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
