import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { userProviders } from './user.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
