import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { User } from '@/entities/user.entity';
import { AuthGuard } from '@/auth/access-token.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';

import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile/me')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: Partial<User>) {
    return this.userService.getProfile(user);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
