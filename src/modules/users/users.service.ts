import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { StoryStatus } from '../stories/enums/story-status.enum';
import { Story } from '../stories/entities/story.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUsername(newUsername: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        username: newUsername,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Username already taken');
    }

    user.username = newUsername;

    return this.userRepository.save(user);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const publishedStoriesCount = await this.storyRepository.count({
      where: {
        userId: user.id,
        status: StoryStatus.PUBLIC,
      },
    });

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      publishedStoriesCount,
    };
  }

  async getMyProfile(userId: number) {
    const user = await this.findOne(userId);

    const publishedStoriesCount = await this.storyRepository.count({
      where: {
        userId,
        status: StoryStatus.PUBLIC,
      },
    });

    const privateStoriesCount = await this.storyRepository.count({
      where: {
        userId,
        status: StoryStatus.PRIVATE,
      },
    });

    return {
      username: user.username,
      createdAt: user.createdAt,
      publishedStoriesCount,
      privateStoriesCount,
    };
  }

  async getUserProfile(userId: number) {
    const user = await this.findOne(userId);

    const publishedStoriesCount = await this.storyRepository.count({
      where: {
        userId,
        status: StoryStatus.PUBLIC,
      },
    });

    return {
      username: user.username,
      createdAt: user.createdAt,
      publishedStoriesCount,
    };
  }
}
