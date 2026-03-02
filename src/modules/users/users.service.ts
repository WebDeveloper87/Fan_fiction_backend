import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { userId: payload.userId, username: payload.username },
        { expiresIn: '2h' },
      );
      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token);
  }

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, { expiresIn: '2h' });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
