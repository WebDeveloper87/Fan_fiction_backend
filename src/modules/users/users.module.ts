import {Module, OnModuleInit} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthController} from "./auth.controller";
import {JwtStrategy} from "./strategy/jwt.strategy";


@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule, PassportModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '1h'},
            }),
        }),
    ],
    providers: [UsersService, JwtStrategy],
    controllers: [UsersController, AuthController],
    exports: [UsersService],

})

export class UsersModule {
}