import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsTrimmed } from '@/decorators/isTrimmed.decorator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '',
  })
  @IsTrimmed()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsTrimmed()
  confirmPassword: string;

  @IsNotEmpty({ message: '' })
  @IsEmail()
  @IsTrimmed()
  email: string;

  @IsString()
  @IsNotEmpty({ message: '' })
  @IsTrimmed()
  token: string;
}
