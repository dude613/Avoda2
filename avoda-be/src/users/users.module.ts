import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { UserService } from './users.service';
import { UserController } from './users.controller';

import { userProviders } from './users.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
