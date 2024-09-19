import {
  Controller,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { TodoService } from "./todo.service";

@Controller("todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post("/create")
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: "toDo created" })
  @ApiBadRequestResponse({ description: "Bad request" })
  async createTo() {
    return true;
  }

  @Post("/list")
  async viewList() {
    return true;
  }

  @Patch("/:id")
  async updateTodo() {
    return true;
  }
}
