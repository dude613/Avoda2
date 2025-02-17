import { Module } from '@nestjs/common';

import { EmailModule } from '@/email/email.module';

import { DatabaseModule } from '@/database/database.module';
import { databaseProviders } from '@/database/database.provider';

import { UsersModule } from '@/users/users.module';
import { UserService } from '@/users/users.service';
import { userProviders } from '@/users/users.provider';

import { organizationProvider } from '@/organizations/organizations.provider';
import { invitesProvider } from '@/auth/invites.provider';

import { AuthService } from './services/auth.service';
import { InvitesService } from './services/invites.service';

import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, DatabaseModule, EmailModule],
  providers: [
    AuthService,
    InvitesService,
    UserService,
    ...userProviders,
    ...databaseProviders,
    ...organizationProvider,
    ...invitesProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
