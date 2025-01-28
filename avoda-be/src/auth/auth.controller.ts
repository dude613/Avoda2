import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';

import { AuthService } from './auth.service';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { CreateUserDTO } from './dto/create-user.dto';

import { RefreshTokenStrategy } from './refresh-token.guard';
import { AccessTokenStrategy } from './access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login-with-password')
  loginWithPassword(@Body() body: AuthCredentialsDTO) {
    return this.authService.loginWithPassword(body);
  }

  @Post('signup-with-password')
  @UseGuards(AccessTokenStrategy)
  signupWithPassword(@Body() body: CreateUserDTO) {
    return this.authService.signupWithPassword(body);
  }

  @Get('/refresh-tokens')
  @UseGuards(RefreshTokenStrategy)
  refreshTokens(@CurrentUser() user: User) {
    return this.authService.refreshToken(user.id);
  }
}
