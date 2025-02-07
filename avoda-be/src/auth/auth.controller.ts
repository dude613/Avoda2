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

import { AuthService } from './services/auth.service';
import { InvitesService } from './services/invites.service';

import { AuthGuard } from './access-token.guard';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateInviteDTO } from './dto/update-invite.dto';
import { InviteMembersDTO } from './dto/invite-members.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly invitesService: InvitesService
  ) {}

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

  @Put('/:id/invite')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(
    USER_PERMISSIONS.INVITE_USER,
    USER_PERMISSIONS.ROOT_PERMISSION
  )
  inviteMember(
    @Param('id') id: string,
    @Body() data: InviteMembersDTO,
    @CurrentUser() user: Partial<User>
  ) {
    return this.invitesService.inviteMember(data, id, user);
  }

  @Post('/update-invite-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  updateInvite(
    @Body() body: UpdateInviteDTO,
    @CurrentUser() user: Partial<User>
  ) {
    return this.invitesService.updateInvite(body, user);
  }
}
