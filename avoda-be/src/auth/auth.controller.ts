import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { Public } from '@/decorators/isPublic.decorator';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';

import { PermissionsGuard } from '@/shared/guards/permissions.guard';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';

import { User } from '@/entities/user.entity';

import { RefreshTokenGuard } from './refresh-token.guard';

import { AuthService } from './auth.service';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { InviteMembersDTO } from './dto/invite-members.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login-with-password')
  @HttpCode(HttpStatus.OK)
  loginWithPassword(@Body() body: AuthCredentialsDTO) {
    return this.authService.loginWithPassword(body);
  }

  @Public()
  @Post('signup-with-password')
  signupWithPassword(@Body() body: CreateUserDTO) {
    return this.authService.signupWithPassword(body);
  }

  @Get('/refresh-tokens')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@CurrentUser() user: User) {
    return this.authService.refreshToken(user.id);
  }
  π;
  @Put('/:id/invite')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(
    USER_PERMISSIONS.INVITE_USER,
    USER_PERMISSIONS.ROOT_PERMISSION,
  )
  inviteMember(
    @Param('id') id: string,
    @Body() data: InviteMembersDTO,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.authService.inviteMember(data, id, user);
  }
}
