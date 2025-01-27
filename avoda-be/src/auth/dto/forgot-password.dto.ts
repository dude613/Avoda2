import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsTrimmed } from '@/decorators/isTrimmed.decorator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: ' This field is required!' })
  @IsEmail()
  @IsTrimmed()
  email: string;
}
