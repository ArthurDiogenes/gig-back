import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VenueModule } from './venue/venue.module';
import { BandsModule } from './bands/bands.module';
import { PostsModule } from './posts/posts.module';
import { ContractModule } from './contract/contract.module';
import { CommentsModule } from './comments/comments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LikesModule } from './likes/likes.module';
import { MusicsModule } from './musics/musics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    VenueModule,
    BandsModule,
    PostsModule,
    ContractModule,
    CommentsModule,
    ReviewsModule,
    LikesModule,
    MusicsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
