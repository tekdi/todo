import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TodoModule } from "./modules/todo/todo.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
