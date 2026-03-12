import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { StoriesModule } from './modules/stories/stories.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RefreshAccessTokenMiddleware } from './middleware/refresh-token.middleware';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LikesModule } from './modules/likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    StoriesModule,
    DatabaseModule,
    AuthModule,
    ReviewsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshAccessTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
