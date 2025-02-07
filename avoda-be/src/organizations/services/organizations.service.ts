import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AppError } from '@/shared/appError.util';
import {
  DATA_SOURCE,
  ORGANIZATIONS_REPOSITORY,
} from '@/shared/constants/database.constants';

import { Organization } from '@/entities/organization.entity';
import { User } from '@/entities/user.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';
import { PermissionEntity } from '@/entities/permissions.entity';

import { USER_PERMISSIONS } from '@/enums/permissions.enum';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(ORGANIZATIONS_REPOSITORY)
    private readonly organizationRepository: Repository<Organization>,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource
  ) {}

  async getOrganizationById(id: string) {
    const organization = await this.organizationRepository.findOneBy({ id });

    if (!organization)
      throw new AppError(
        `No organization found with id: ${id}`,
        HttpStatus.NOT_FOUND
      );

    return organization;
  }

  async getYourOrganizations(user: Partial<User>) {
    const organizations = await this.organizationRepository.find({
      where: [
        { createdBy: { id: user.id } }, // Organizations the user owns
        { members: { user: { id: user.id } } }, // Organizations where the user is a member
      ],
      relations: ['members'], // Load Relationship (performs a JOIN)
      // select only necessary fields
      select: {
        members: {
          role: true,
        },
      },
    });

    return organizations.map(({ members, ...item }) => ({
      ...item,
      roles: members.map((el) => el.role),
    }));
  }

  async createOrganization(name: string, user: Partial<User>) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      // create the organization
      const org = queryRunner.manager.create(Organization, {
        name,
        createdBy: { id: user.id },
        isDefaultOrg: 0,
      });

      await this.organizationRepository.save(org);

      // add user as an organization member
      const createMember = queryRunner.manager.create(OrganizationMembers, {
        user: { id: user.id },
        organization: { id: org.id },
      });

      await queryRunner.manager.save(createMember);

      // create default permissions for user
      const permission = queryRunner.manager.create(PermissionEntity, {
        member: { id: createMember.id },
        permission: USER_PERMISSIONS.ROOT_PERMISSION,
      });

      await queryRunner.manager.save(permission);

      await queryRunner.commitTransaction();

      return 'Organization created successfully';
    } catch {
      await queryRunner.rollbackTransaction();

      throw new AppError(
        'Error creating organization',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    } finally {
      queryRunner.release();
    }
  }
}
