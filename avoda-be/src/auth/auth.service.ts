import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppError } from '@/shared/appError.util';

import { User } from '@/entities/user.entity';

import { JWTPayload } from '@/auth/jwt-payload.type';
import { CreateUserDTO } from '@/auth/dto/create-user.dto';
import { AuthCredentialsDTO } from '@/auth/dto/auth-credentials.dto';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signupWithPassword(createUserDto: CreateUserDTO) {
    // check if the user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) throw new AppError('', HttpStatus.CONFLICT);

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return 'user created successfully';
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

    throw new AppError('', HttpStatus.BAD_REQUEST);
  }

  async refreshToken(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    const tokens = await this.generateTokens({
      sub: user.id,
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

    return '';
  }

  private async generateTokens(auth: JWTPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(auth, {
        expiresIn: 60 * 60 * 24,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(auth, {
        // Access token will expire in 1week
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
