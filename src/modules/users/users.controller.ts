import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UsersService} from './users.service';
import {RefreshUserDto} from "./dto/refresh-user.dto";
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @Get()
    findAll() {
        return this.usersService.findAll();
    }
    @Post('refresh')
    async refresh(@Body() dto: RefreshUserDto) {
        return this.usersService.refresh(dto.refreshToken);
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

}

