import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StoryStatus } from '../enums/story-status.enum';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'enum', enum: StoryStatus, default: StoryStatus.PRIVATE })
  status: StoryStatus;

  @Column()
  fandom: string;

  @Column()
  genre: string;

  @Column()
  prompt: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Like, (like) => like.story)
  likes: Like[];
}
