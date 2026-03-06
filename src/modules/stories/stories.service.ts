import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { AiStoryDto } from './dto/ai-story.dto';

@Injectable()
export class StoriesService {
  private genAI: GoogleGenAI;

  constructor(
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    this.genAI = new GoogleGenAI({ apiKey });
  }

  async AiGenerate(dto: AiStoryDto) {
    const prompt = dto.getPrompt();

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      text: response.text,
    };
  }

  async generateAndSave(dto: AiStoryDto, userId: number) {
    const generatedContent = await this.AiGenerate(dto);

    if (!generatedContent.text) {
      throw new Error('AI did not return any text');
    }

    const createDto: CreateStoryDto = {
      title: dto.title,
      fandom: dto.fandom,
      genre: dto.genre,
      prompt: dto.getPrompt(),
      content: generatedContent.text,
    };

    return await this.save(createDto, userId);
  }

  async save(dto: CreateStoryDto, userId: number) {
    const story = this.storyRepository.create({
      ...dto,
      userId,
    });

    return await this.storyRepository.save(story);
  }

  async findAllByUserId(userId: number) {
    return await this.storyRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.storyRepository.find();
  }

  findOne(id: number) {
    return this.storyRepository.findOne({ where: { id } });
  }

  async setNewStatus(storyId: number, status, userId) {
    const story = await this.storyRepository.findOne({
      where: {
        id: storyId,
        userId: userId,
      },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    story.status = status;

    return this.storyRepository.save(story);
  }

  async getStories(limit: number, page: number) {
    return this.storyRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
        id: 'DESC'
      },
    });
  }
}
