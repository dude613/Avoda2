import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '@/entities/user.entity';
import { USER_REPOSITORY } from '@/shared/constants/database.constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: string) {
    return {
      sub: id,
      name: 'John Doe',
      email: '',
    };
  }
}
