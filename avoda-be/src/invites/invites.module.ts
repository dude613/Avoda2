import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';

import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { invitesProvider } from './invites.provider';

@Module({
  imports: [DatabaseModule],
  providers: [InvitesService, ...invitesProvider],
  controllers: [InvitesController],
})
export class InvitesModule {}
