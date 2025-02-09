import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AppError } from '@/shared/appError.util';

import { UserService } from '@/users/users.service';
import { IS_PUBLIC_KEY } from '@/decorators/isPublic.decorator';

import { JWTPayload } from '@/auth/jwt-payload.type';

@Injectable()
export abstract class BaseAuthStrategy implements CanActivate {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService,
    private readonly reflector: Reflector
  ) {}

  protected abstract getSecretKey(): string;
  protected abstract handleValidatedUser(user: any, request: Request): void;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublicRoute(context);

    // for public routes
    if (isPublic) return true;

    const request = this.getRequest(context);
    const token = this.extractToken(request);
    const payload = await this.verifyToken(token);
    const user = await this.validateUser(payload);

    this.handleValidatedUser(user, request);
    return true;
  }

  private isPublicRoute(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }

  private extractToken(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token || type !== 'Bearer') {
      throw new AppError('Invalid or missing token', HttpStatus.UNAUTHORIZED);
    }

    return token;
  }

  private async verifyToken(token: string): Promise<JWTPayload> {
    const secret = this.configService.get<string>(this.getSecretKey());

    return await this.jwtService.verify(token, { secret });
  }

  private async validateUser(payload: JWTPayload) {
    // There would be no need t perform a check.
    // The user service already checks and throws an error
    // if no user is found. So just return the data from the service
    return await this.userService.getUserById(payload.sub);
  }
}
