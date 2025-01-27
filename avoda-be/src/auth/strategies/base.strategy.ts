import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AppError } from '@/shared/appError.util';

type TOKEN_SECRET = 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET';

type SECRET_CONFIG = {
  configService: ConfigService;
  secretType: TOKEN_SECRET;
  jwtService: JwtService;
};

export class BaseStrategy implements CanActivate {
  constructor(private readonly config: SECRET_CONFIG) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new AppError('No token provided', HttpStatus.UNAUTHORIZED);
    }
    try {
      // This will be checked at runtime
      const secret = this.config.configService.get<string>(
        this.config.secretType,
      );

      const payload = await this.config.jwtService.verifyAsync(token, {
        secret,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new AppError('No token provided', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
