import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

import { BaseAuthStrategy } from './strategies/base.strategy';

@Injectable()
export class RefreshTokenStrategy extends BaseAuthStrategy {
  protected getSecretKey(): string {
    return 'JWT_REFRESH_SECRET';
  }

  protected handleValidatedUser(user: any, request: Request): void {
    request['user'] = user;
  }
}
