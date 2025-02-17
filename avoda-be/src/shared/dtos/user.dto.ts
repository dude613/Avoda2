import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString({ message: 'value must be of type string' })
  @IsNotEmpty()
  id: string;

  @IsString({ message: 'value must be of type string' })
  @IsNotEmpty()
  firstName: string;

  @IsString({ message: 'value must be of type string' })
  @IsNotEmpty()
  lastName: string;

  @IsString({ message: 'value must be of type string' })
  @IsNotEmpty()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
