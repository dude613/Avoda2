import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppError } from '@/shared/appError.util';
import {
  DATA_SOURCE,
  USER_REPOSITORY,
} from '@/shared/constants/database.constants';

import { User } from '@/entities/user.entity';
import { Organization } from '@/entities/organization.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';
import { PermissionEntity } from '@/entities/permissions.entity';

import { JWTPayload } from '@/auth/jwt-payload.type';

import { CreateUserDTO } from '@/auth/dto/create-user.dto';
import { AuthCredentialsDTO } from '@/auth/dto/auth-credentials.dto';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  async signupWithPassword(createUserDto: CreateUserDTO) {
    // check if the user exists
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser)
      throw new AppError(
        'Unable to complete registration. Please try again or contact support.',
        HttpStatus.CONFLICT
      );

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
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
        user
      );

      // 1b. Add user as owner of default Org
      const savedOrgMember = await this.addDefaultOrgMember(
        queryRunner,
        id,
        user
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
        HttpStatus.UNPROCESSABLE_ENTITY
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

    throw new AppError('Invalid email or password!', HttpStatus.NOT_FOUND);
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

  private async createDefaultOrganization(
    queryRunner: QueryRunner,
    createUserDto: CreateUserDTO,
    user: User
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
    user: User
  ) {
    const createMember = queryRunner.manager.create(OrganizationMembers, {
      user: { id: user.id },
      organization: { id: orgId },
    });

    return await queryRunner.manager.save(createMember);
  }

  private async createDefaultPermission(
    queryRunner: QueryRunner,
    memberId: string
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
