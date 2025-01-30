import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AppError } from '@/shared/appError.util';
import {
  ORGANIZATIONS_MEMBERS_REPOSITORY,
  ORGANIZATIONS_REPOSITORY,
} from '@/shared/constants/database.constants';

import { Organization } from '@/entities/organization.entity';
import { User } from '@/entities/user.entity';
import { OrganizationMembers } from '@/entities/org-member.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(ORGANIZATIONS_REPOSITORY)
    private readonly organizationRepository: Repository<Organization>,
    @Inject(ORGANIZATIONS_MEMBERS_REPOSITORY)
    private readonly orgMemberRepository: Repository<OrganizationMembers>,
  ) {}

  async getOrganizationById(id: string) {
    const organization = await this.organizationRepository.findOneBy({ id });

    if (!organization)
      throw new AppError(
        `No organization found with id: ${id}`,
        HttpStatus.NOT_FOUND,
      );

    return organization;
  }

  async getYourOrganizations(user: Partial<User>) {
    const organizations = await this.orgMemberRepository
      .createQueryBuilder(OrganizationMembers.name)
      .where({ user: { id: user.id } })
      .leftJoinAndSelect(`${OrganizationMembers.name}.organization`, 'org')
      .getMany();

    return organizations;
  }
}
