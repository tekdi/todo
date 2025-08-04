import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgresBookmarkService } from "./bookmark-adapter";
import { Bookmark } from "src/modules/bookmark/entity/bookmark.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
  ],
  providers: [PostgresBookmarkService],
  exports: [PostgresBookmarkService],
})
export class PostgresModule {} 