import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TodoModule } from "./modules/todo/todo.module";
import { BookmarkModule } from "./modules/bookmark/bookmark.module";
import { DatabaseModule } from "./common/database-modules";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TodoModule,
    BookmarkModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
