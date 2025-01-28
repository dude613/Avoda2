import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '@/users/users.service';

import { JWTPayload } from '@/auth/jwt-payload.type';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer', '').trim();

      // decode token and get user id stored in it
      const decoded = (await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      })) as JWTPayload;

      const user = await this.userService.getUserById(decoded.sub);

      req['user'] = user;
    }
    next();
  }
}
