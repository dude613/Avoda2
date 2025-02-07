import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OrganizationMembers } from '@/entities/org-member.entity';
import { ORGANIZATIONS_MEMBERS_REPOSITORY } from '@/shared/constants/database.constants';

@Injectable()
export class MemberService {
  constructor(
    @Inject(ORGANIZATIONS_MEMBERS_REPOSITORY)
    private readonly membersEntity: Repository<OrganizationMembers>
  ) {}
  async getMembers(id: string) {
    const members = await this.membersEntity
      .createQueryBuilder('m')
      .where({ organization: { id } })
      .leftJoinAndSelect('m.permissions', 'p')
      .leftJoinAndSelect('m.user', 'u')
      .select([
        'm.id',
        'm.role',
        'm.createdAt',
        'm.updatedAt',
        'u.id',
        'u.first_name',
        'u.last_name',
        'u.email',
        'p.permission',
      ]) // Get only necessary fields
      .getMany();

    return members.map((member) => ({
      ...member,
      permissions: member.permissions.map((perm) => perm.permission), // Extract only the permission string
    }));
  }
}
