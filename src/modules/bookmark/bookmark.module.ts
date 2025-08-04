import { Module } from "@nestjs/common";
import { BookmarkController } from "./bookmark.controller";
import { BookmarkAdapter } from "./bookmarkadapter";
import { PostgresModule } from "src/adapters/postgres/postgres-module";

@Module({
  imports: [PostgresModule],
  controllers: [BookmarkController],
  providers: [BookmarkAdapter],
})
export class BookmarkModule {} 