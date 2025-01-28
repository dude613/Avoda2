import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JWTPayload } from '@/auth/jwt-payload.type';
import { BaseStrategy } from '@/auth/strategies/base.strategy';
import { UserService } from '@/users/users.service';

import { AppError } from '@/shared/appError.util';

@Injectable()
export class AccessTokenStrategy extends BaseStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({ configService, secretType: 'JWT_ACCESS_SECRET', jwtService });
  }

  public async validate(payload: JWTPayload) {
    const { sub } = payload;

    // find user using the provided token
    const user = await this.userService.getUserById(sub);

    if (!user) throw new AppError('No User Found', HttpStatus.NOT_FOUND);

    return user;
  }
}
