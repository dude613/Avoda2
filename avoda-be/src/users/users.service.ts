import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
  ORGANIZATIONS_REPOSITORY,
  USER_REPOSITORY,
} from '@/shared/constants/database.constants';

import { User } from '@/entities/user.entity';
import { Organization } from '@/entities/organization.entity';

import { AppError } from '@/shared/appError.util';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    @Inject(ORGANIZATIONS_REPOSITORY)
    private readonly organizationsRepository: Repository<Organization>
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new AppError(`No user found with id: ${id}`, HttpStatus.NOT_FOUND);

    return user;
  }

  async getProfile(currentUser: Partial<User>) {
    // There would be no need t perform a check
    const user = await this.getUserById(currentUser.id);

    //  call the organizations repository
    const organizations = await this.organizationsRepository.find({
      where: { createdBy: { id: currentUser.id } },
    });

    return {
      user,
      organizations,
    };
  }
}
