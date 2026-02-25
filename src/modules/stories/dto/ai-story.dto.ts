import {IsNotEmpty, IsString} from "class-validator";

export class AiStoryDto {
    @IsNotEmpty()
    @IsString()
    language : string;

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
    characters: string;

    getPrompt(): string {
        return `
            Write a ${this.genre} story for the fandom "${this.fandom}".
            Title: ${this.title}.
            Language: ${this.language}.
            Characters: ${this.characters}.
            The story must be at least 500 words long.
            Create a captivating story based on these elements.
            Return only the story text.
        `;
    }
}