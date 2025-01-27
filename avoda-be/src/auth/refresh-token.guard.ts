import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JWTPayload } from '@/auth/jwt-payload.type';
import { BaseStrategy } from '@/auth/strategies/base.strategy';
import { UserService } from '@/user/user.service';

@Injectable()
export class RefreshTokenStrategy extends BaseStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({ configService, secretType: 'JWT_REFRESH_SECRET', jwtService });
  }

  public async validate(payload: JWTPayload, @Req() req: Request) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    return { ...payload, refreshToken };
  }
}
