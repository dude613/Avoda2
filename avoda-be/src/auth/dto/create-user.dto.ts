import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsTrimmed } from '@/decorators/isTrimmed.decorator';

export class CreateUserDTO {
  @IsString({ message: '' })
  @IsNotEmpty({ message: '' })
  @IsTrimmed()
  firstName: string;

  @IsString({ message: '' })
  @IsNotEmpty({ message: '' })
  @IsTrimmed()
  lastName: string;

  @IsString({ message: '' })
  @IsNotEmpty({ message: '' })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number or special character',
  })
  @IsTrimmed()
  password: string;

  @IsString({ message: '' })
  @IsNotEmpty({ message: '' })
  @IsEmail()
  @IsTrimmed()
  email: string;

  @IsOptional()
  @IsDateString()
  @IsTrimmed()
  dob?: Date;
}
