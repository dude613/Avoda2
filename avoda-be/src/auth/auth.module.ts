import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './access-token.guard';

import { DatabaseModule } from '@/database/database.module';
import { databaseProviders } from '@/database/database.provider';

import { UsersModule } from '@/users/users.module';
import { UserService } from '@/users/users.service';
import { userProviders } from '@/users/users.provider';

@Module({
  imports: [UsersModule, DatabaseModule],
  providers: [
    AuthService,
    AccessTokenStrategy,
    UserService,
    ...userProviders,
    ...databaseProviders,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
