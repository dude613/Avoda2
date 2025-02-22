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
import { Matcher } from '@/decorators/matcher.decorator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsTrimmed()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsTrimmed()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number or special character',
  })
  @IsTrimmed()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matcher('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsTrimmed()
  email: string;

  @IsOptional()
  @IsDateString()
  @IsTrimmed()
  dob?: Date;
}
