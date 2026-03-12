import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from '../../stories/entities/story.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Story, (story) => story.user)
  stories: Story[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
