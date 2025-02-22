import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

import { BaseAuthStrategy } from './strategies/base.strategy';

@Injectable()
export class RefreshTokenGuard extends BaseAuthStrategy {
  protected getSecretKey(): string {
    return 'JWT_REFRESH_SECRET';
  }

  protected handleValidatedUser(user: any, @Req() request: Request): void {
    request['user'] = user;
  }
}
