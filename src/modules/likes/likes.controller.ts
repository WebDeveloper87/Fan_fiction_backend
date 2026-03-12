import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req, UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';


@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Param('id') storyId: number, @Req() req) {
    return this.likesService.toggleLike(storyId, req.user.userId);
  }
}
