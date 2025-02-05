import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource, In, Repository } from 'typeorm';

import { EmailService } from '@/email/email.service';

import { InviteMembersDTO } from '@/auth/dto/invite-members.dto';

import { InvitesRepository } from '@/entities/invites.entity';
import { User } from '@/entities/user.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';

import {
  DATA_SOURCE,
  INVITES_REPOSITORY,
} from '@/shared/constants/database.constants';
import { INVITE_STATUS } from '@/shared/constants/invite-status.constants';

import { AppError } from '@/shared/appError.util';

import { UpdateInviteDTO } from '@/auth/dto/update-invite.dto';

@Injectable()
export class InvitesService {
  private TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 3 * 1000;
  constructor(
    @Inject(INVITES_REPOSITORY)
    private readonly invitesRepository: Repository<InvitesRepository>,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}
  async inviteMember(data: InviteMembersDTO, id: string, user: Partial<User>) {
    const existingInvites = await this.invitesRepository.find({
      where: {
        email: In(data.emails),
        status: INVITE_STATUS.PENDING,
        organization: { id },
      },
      select: ['status', 'email'], // Fetch only necessary fields
    });

    const existingEmails = new Set(
      existingInvites.map((invite) => invite.email)
    );

    const newEmails = data.emails.filter((email) => !existingEmails.has(email));

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      // Get the member who's doing the invite
      const memberId = await queryRunner.manager.findOneBy(
        OrganizationMembers,
        {
          user: { id: user.id },
        }
      );

      let newInvites: InvitesRepository[] = [];

      if (newEmails.length) {
        const invitesToCreate = newEmails.map((email) => ({
          email,
          organization: { id },
          invitedBy: { id: memberId.id },
          expiresAt: new Date(Date.now() + this.TOKEN_EXPIRATION_TIME),
        }));

        const entity = this.invitesRepository.create(invitesToCreate);

        newInvites = await this.invitesRepository.save(entity);
      }

      const allInvites = [...existingInvites, ...newInvites];

      const emailPromises = allInvites.map(async (invite) => {
        const tokenData = await this.generateInviteToken(invite, id);

        await this.sendInviteEmail(tokenData);

        return tokenData.email;
      });

      await Promise.all(emailPromises);

      return 'Invite(s) sent';
    } finally {
      await queryRunner.release();
    }
  }

  async updateInvite(data: UpdateInviteDTO) {
    const decodedToken: { sub: string; email: string; organizationId: string } =
      await this.jwtService.verifyAsync(data.token, {
        secret: this.configService.get<string>('JWT_INVITE_TOKEN_SECRET'),
      });

    const invite = await this.invitesRepository.findOne({
      where: {
        id: decodedToken.sub,
        organization: { id: decodedToken.organizationId },
        status: INVITE_STATUS.PENDING,
      },
    });

    if (!invite) {
      throw new AppError('No invite found for this user', HttpStatus.NOT_FOUND);
    }

    await this.invitesRepository.update(
      { id: invite.id, organization: { id: decodedToken.organizationId } },
      { status: data.status, acceptedAt: new Date(Date.now()) }
    );

    return 'Status updated successfully';
  }

  private async sendInviteEmail(emailData: { email: string; url: string }) {
    await this.emailService.sendEmailAsync({
      to: emailData.email,
      text: `organization-invite \n ${emailData.url}`,
      subject: 'Invite to join the team',
    });
  }

  private async generateInviteToken(
    invite: InvitesRepository,
    organizationId: string
  ) {
    const token = await this.jwtService.signAsync(
      {
        sub: invite.id,
        email: invite.email,
        organizationId,
      },
      {
        expiresIn: this.TOKEN_EXPIRATION_TIME,
        secret: this.configService.get<string>('JWT_INVITE_TOKEN_SECRET'),
      }
    );

    return {
      email: invite.email,
      url: `${this.configService.get<string>('FRONTEND_URL')}?token=${token}`,
    };
  }
}
