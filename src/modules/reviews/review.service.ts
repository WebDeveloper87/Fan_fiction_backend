import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  create(dto: CreateReviewDto, userId: number) {
    const review = this.reviewRepository.create({
      content: dto.content,
      userId: userId,
    });

    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find();
  }
}
