import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { ManyToOne } from 'typeorm';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  fandom: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
