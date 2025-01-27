import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { IsTrimmed } from '@/decorators/isTrimmed.decorator';

export class AuthCredentialsDTO {
  @IsNotEmpty({ message: '' })
  @IsString()
  @IsEmail()
  @IsTrimmed()
  email: string;

  @IsNotEmpty({ message: '' })
  @IsString()
  @IsTrimmed()
  password: string;
}
