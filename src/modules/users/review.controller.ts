import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateReviewDto, @Req() req) {
    return this.reviewService.create(dto, req.user.userId);
  }
}
