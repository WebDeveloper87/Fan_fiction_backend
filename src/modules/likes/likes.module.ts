import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { Story } from '../stories/entities/story.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Story])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
