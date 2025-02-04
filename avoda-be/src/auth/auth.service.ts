import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppError } from '@/shared/appError.util';
import {
  DATA_SOURCE,
  INVITES_REPOSITORY,
  USER_REPOSITORY,
} from '@/shared/constants/database.constants';

import { User } from '@/entities/user.entity';
import { Organization } from '@/entities/organization.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';
import { PermissionEntity } from '@/entities/permissions.entity';
import { InvitesRepository } from '@/entities/invites.entity';

import { JWTPayload } from '@/auth/jwt-payload.type';

import { EmailService } from '@/email/email.service';

import { CreateUserDTO } from '@/auth/dto/create-user.dto';
import { InviteMembersDTO } from '@/auth/dto/invite-members.dto';
import { AuthCredentialsDTO } from '@/auth/dto/auth-credentials.dto';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    @Inject(INVITES_REPOSITORY)
    private readonly invitesRepository: Repository<InvitesRepository>,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}
  async signupWithPassword(createUserDto: CreateUserDTO) {
    // check if the user exists
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser)
      throw new AppError(
        'Cannot create user at this time. Please try again later.',
        HttpStatus.CONFLICT,
      );

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.startTransaction();

    try {
      // 1. Create the user
      const user = queryRunner.manager.create(User, {
        ...createUserDto,
        first_name: createUserDto.firstName,
        last_name: createUserDto.lastName,
        password: hashedPassword,
      });

      await queryRunner.manager.save(user);

      // 1a. Insert into the org table
      const { id } = await this.createDefaultOrganization(
        queryRunner,
        createUserDto,
        user,
      );

      // 1b. Add user as owner of default Org
      const savedOrgMember = await this.addDefaultOrgMember(
        queryRunner,
        id,
        user,
      );

      // 2a Create permission
      await this.createDefaultPermission(queryRunner, savedOrgMember.id);

      await queryRunner.commitTransaction();

      return 'user created successfully';
    } catch {
      // Don't commit anything to the database
      await queryRunner.rollbackTransaction();

      // throw the error so the AppError can catch it
      throw new AppError(
        'Failed to create user at this time!. Please try again',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async loginWithPassword(authCredentialsDto: AuthCredentialsDTO) {
    const { email, password } = authCredentialsDto;

    const query = this.userRepository.createQueryBuilder(User.name);
    const user = await query.where({ email }).getOne();

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // 2) RETURN THE USER IF FOUND AND ADD THE TOKEN TO THE REQUEST BODY
      const tokens = await this.generateTokens({
        sub: user.id,
      });

      return {
        user,
        tokens,
      };
    }

    throw new AppError('No user found!!', HttpStatus.BAD_REQUEST);
  }

  async refreshToken(id: string) {
    const tokens = await this.generateTokens({
      sub: id,
    });
    return { tokens };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    // find the user based on teh given email
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    // If no user is found, YELL!!!
    if (!user) throw new AppError('', HttpStatus.BAD_REQUEST);

    // TODO: Add meaningful success message
    return 'Put something here later';
  }

  async inviteMember(data: InviteMembersDTO, id: string, user: Partial<User>) {
    const TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 3 * 1000;

    const queryRunner = this.dataSource.createQueryRunner();

    // Get the member who's doing the invite
    const memberId = await queryRunner.manager.findOneBy(OrganizationMembers, {
      user: { id: user.id },
    });

    const invites = data.emails.map((invite) => ({
      email: invite,
      organization: { id },
      invitedBy: { id: memberId.id },
      expiresAt: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
    }));

    const repo = this.invitesRepository.create(invites);

    // save the invites to the invites table
    const savedInvites = await this.invitesRepository.save(repo);

    const tokens = await Promise.all(
      savedInvites.map(async (invite) => {
        const token = await this.jwtService.signAsync(
          { sub: invite.id, email: invite.email, organizationId: id },
          {
            // token should expire in one day
            expiresIn: TOKEN_EXPIRATION_TIME,
            secret: this.configService.get<string>('JWT_INVITE_TOKEN_SECRET'),
          },
        );

        const url = `${this.configService.get<string>('FRONTEND_URL')}?token=${token}`;

        return { email: invite.email, url };
      }),
    );

    // send email to the person being invited
    tokens.map(async (mail) => {
      await this.emailService.sendEmailAsync({
        to: mail.email,
        text: `This is your invite token\n ${mail.url}`,
        subject: 'Invite to your team',
        from: user.email,
      });
    });

    return 'Invite(s) sent';
  }

  private async createDefaultOrganization(
    queryRunner: QueryRunner,
    createUserDto: CreateUserDTO,
    user: User,
  ) {
    const doc = queryRunner.manager.create(Organization, {
      name: `${createUserDto.firstName}-${createUserDto.lastName}-org`,
      createdBy: user,
    });

    return await queryRunner.manager.save(doc);
  }

  private async addDefaultOrgMember(
    queryRunner: QueryRunner,
    orgId: string,
    user: User,
  ) {
    const createMember = queryRunner.manager.create(OrganizationMembers, {
      user: { id: user.id },
      organization: { id: orgId },
    });

    return await queryRunner.manager.save(createMember);
  }

  private async createDefaultPermission(
    queryRunner: QueryRunner,
    memberId: string,
  ) {
    const userPermissions = queryRunner.manager.create(PermissionEntity, {
      member: { id: memberId },
      permission: USER_PERMISSIONS.ROOT_PERMISSION,
    });

    return await queryRunner.manager.save(userPermissions);
  }

  private async generateTokens(auth: JWTPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(auth, {
        expiresIn: 60 * 60 * 24,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(auth, {
        // refresh token will expire in 1week
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
