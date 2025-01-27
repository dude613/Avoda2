import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './access-token.guard';

import { UserModule } from '@/user/user.module';
import { UserService } from '@/user/user.service';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule],
  providers: [AuthService, AccessTokenStrategy, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
