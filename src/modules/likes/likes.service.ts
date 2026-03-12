import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { Story } from '../stories/entities/story.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
  ) {}


  async toggleLike(storyId: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const story = await this.storyRepository.findOneBy({ id: storyId });

    if (!user || !story) {
      throw new NotFoundException('User or Story not found');
    }

    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, story: { id: storyId } },
      relations: ['user', 'story'],
    });

    if (like) {
      await this.likeRepository.remove(like);
      return { liked: false };
    }

    const newLike = this.likeRepository.create({ user, story });
    await this.likeRepository.save(newLike);
    return { liked: true };
  }
}

