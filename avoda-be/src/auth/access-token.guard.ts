import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

import { BaseAuthStrategy } from './strategies/base.strategy';

@Injectable()
export class AccessTokenStrategy extends BaseAuthStrategy {
  protected getSecretKey(): string {
    return 'JWT_ACCESS_SECRET';
  }

  protected handleValidatedUser(user: any, @Req() request: Request): void {
    request['user'] = user;
  }
}
