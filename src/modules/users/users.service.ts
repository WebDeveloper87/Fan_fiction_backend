import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {
    }

    async create(dto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: dto.email }
        });

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            email: dto.email,
            username: dto.username,
            password: hashedPassword
        });

        const savedUser = await this.userRepository.save(user);

        const payload = { userId: savedUser.id, username: savedUser.username };
        const token = this.jwtService.sign(payload);

        const { password, ...userData } = savedUser;
        return {
            user: userData,
            token
        };
    }

    async refresh(refreshToken: string) {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });

        const newAccessToken = await this.jwtService.signAsync(
            { sub: payload.sub },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        return {
            accessToken: newAccessToken,
        };
    }

    async login(dto: LoginUserDto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
            select: ['id', 'username', 'password'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { userId: user.id, username: user.username };
        const token = this.jwtService.sign(payload);

        const { password, ...userData } = user;
        return { user: userData, token };
    }

    findAll() {
        return this.userRepository.find();
    }

    findOne(id: number) {
        return this.userRepository.findOne({
            where: {
                id: id
            }
        });
    }
}
