import { Module } from "@nestjs/common";
import { BookmarkController } from "./bookmark.controller";
import { BookmarkService } from "./bookmark.service";
import { Bookmark } from "./entity/bookmark.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {} 