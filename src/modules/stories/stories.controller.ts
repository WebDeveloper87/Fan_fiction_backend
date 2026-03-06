import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Req, Patch,
} from '@nestjs/common'; // Додано Request
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { AiStoryDto } from './dto/ai-story.dto';
import { StoryStatusDto } from './dto/story-status.dto';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Body() dto: AiStoryDto) {
    return await this.storiesService.AiGenerate(dto);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async save(@Body() dto: CreateStoryDto, @Req() req) {
    return await this.storiesService.save(dto, req.user.userId);
  }

  @Post('generate-and-save')
  @UseGuards(JwtAuthGuard)
  async generateAndSave(@Body() dto: AiStoryDto, @Req() req) {
    return await this.storiesService.generateAndSave(dto, req.user.userId);
  }

  @Get('my-stories')
  @UseGuards(JwtAuthGuard)
  findAllMyStories(@Request() req) {
    return this.storiesService.findAllByUserId(req.user.userId);
  }

  @Get()
  findAll() {
    return this.storiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storiesService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: StoryStatusDto,
    @Req() req,
  ) {
    return this.storiesService.setNewStatus(+id, dto.status, req.user.userId);
  }

  @Get(':limit/:page')
  @UseGuards(JwtAuthGuard)
  async getStories(@Param('limit') limit: number, @Param('page') page: number) {
    return this.storiesService.getStories(+limit, +page);
  }
}
