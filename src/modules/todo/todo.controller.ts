import {
  Body,
  Controller,
  Patch,
  Post,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { Response } from "express";
import { AllExceptionsFilter } from "src/common/utils/exception.filter";
import { API_ID } from "src/common/utils/constants.util";

@Controller("todo")
@ApiTags("Todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseFilters(new AllExceptionsFilter(API_ID.CREATE_TODO))
  @Post("/create")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiCreatedResponse({ description: "toDo created" })
  @ApiBody({ type: CreateTodoDto })
  @ApiBadRequestResponse({ description: "Bad request" })
  async createTo(
    @Body() createTodoDto: CreateTodoDto,
    @Res() response: Response,
  ) {
    return await this.todoService.createTodo(createTodoDto, response);
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
