import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';

import { AppError } from '@/shared/appError.util';
import { USER_ROLES } from '@/shared/constants/user-role.constants';
import { ORGANIZATIONS_MEMBERS_REPOSITORY } from '@/shared/constants/database.constants';

import { OrganizationMembers } from '@/entities/org-member.entity';

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

  async getMemberProfile(id: string, orgId: string) {
    const member = await this.membersEntity
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.permissions', 'p')
      .leftJoinAndSelect('m.user', 'u')
      .where({ organization: { id: orgId }, id })
      .getOne();

    if (!member) {
      throw new AppError(
        `Member not found in the organization. member with id ${id} does not exist`,
        HttpStatus.NOT_FOUND
      ); // If member not found, throw error with 404 status code
    }

    return {
      ...member,
      permissions: member.permissions.map((perm) => perm.permission), // Extract only the permission string
    };
  }

  async getCurrentUserOrganizationProfile(id: string, orgId: string) {
    const member = await this.membersEntity
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.permissions', 'p')
      .leftJoinAndSelect('m.user', 'u')
      .where({ organization: { id: orgId }, user: { id } })
      .getOne();

    if (!member) {
      throw new AppError(
        `Member not found in the organization. member with id ${id} does not exist`,
        HttpStatus.NOT_FOUND
      ); // If member not found, throw error with 404 status code
    }

    return {
      ...member,
      permissions: member.permissions.map((perm) => perm.permission), // Extract only the permission string
    };
  }

  async removeMemberFromOrganization(id: string, orgId: string) {
    const res = await this.membersEntity.softDelete({
      id,
      organization: { id: orgId },
      role: Not(USER_ROLES.OWNER),
    });

    if (!res.affected) {
      throw new AppError(
        'Unable to remove member from organization. Please try again',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return 'Member deleted successfully';
  }
}
