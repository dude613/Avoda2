import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsTrimmed } from '@/decorators/isTrimmed.decorator';

export class PassWordChangeDTO {
  @IsString()
  @IsNotEmpty({ message: '' })
  @IsTrimmed()
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: '' })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number or special character',
  })
  @IsTrimmed()
  newPassword: string;

  @IsNotEmpty({ message: '' })
  @IsString()
  @IsTrimmed()
  confirmPassword: string;
}
