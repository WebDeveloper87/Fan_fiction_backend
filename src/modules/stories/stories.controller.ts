import {Controller, Get, Post, Body, Param, UseGuards, Request, Req} from '@nestjs/common'; // Додано Request
import {StoriesService} from './stories.service';
import {CreateStoryDto} from './dto/create-story.dto';
import {JwtAuthGuard} from '../users/guards/jwt-auth.guard';
import {AiStoryDto} from "./dto/ai-story.dto";

@Controller('stories')
export class StoriesController {
    constructor(private readonly storiesService: StoriesService) {
    }

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
    async generateAndSave(@Body() dto: AiStoryDto, @Req() req,) {
        const generatedContent = await this.storiesService.AiGenerate(dto);

        if (!generatedContent.text) {
            throw new Error('AI did not return any text');
        }

        const createDto: CreateStoryDto = {
            title: dto.title,
            fandom: dto.fandom,
            genre: dto.genre,
            prompt: dto.getPrompt(),
            content: generatedContent.text
        };

        return await this.storiesService.save(createDto, req.user.userId);
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
}
