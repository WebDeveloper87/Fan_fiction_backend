import {Body, Controller, Post} from "@nestjs/common";
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.usersService.login(dto);
    }
}