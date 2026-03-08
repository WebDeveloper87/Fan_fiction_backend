import { IsEnum, IsNotEmpty } from 'class-validator';
import { StoryStatus } from '../enums/story-status.enum';

export class StoryStatusDto {
  @IsEnum(StoryStatus)
  @IsNotEmpty()
  status: StoryStatus;
}
