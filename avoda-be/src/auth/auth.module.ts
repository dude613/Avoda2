import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './access-token.guard';

import { UserModule } from '@/user/user.module';
import { UserService } from '@/user/user.service';
import { userProviders } from '@/user/user.provider';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [AuthService, AccessTokenStrategy, UserService, ...userProviders],
  controllers: [AuthController],
})
export class AuthModule {}
