import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { UserService } from './users.service';
import { UserController } from './users.controller';

import { userProviders } from './users.provider';
import { organizationProvider } from '../organizations/organizations.provider';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...userProviders, ...organizationProvider],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
