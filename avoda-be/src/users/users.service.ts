import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '@/entities/user.entity';

import { USER_REPOSITORY } from '@/shared/constants/database.constants';
import { AppError } from '@/shared/appError.util';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new AppError(`No user found with id: ${id}`, HttpStatus.NOT_FOUND);

    return user;
  }
}
