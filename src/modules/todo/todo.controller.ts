import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { Response } from "express";
import { AllExceptionsFilter } from "src/common/utils/exception.filter";
import {
  API_ID,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "src/common/utils/constants.util";
import { FilterRequestDTO } from "./dto/list-todo.dto";
import { TodoDateValidationPipe } from "src/common/utils/pipe.util";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Controller("todo")
@ApiTags("Todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseFilters(new AllExceptionsFilter(API_ID.CREATE_TODO))
  @Post("/create")
  @UsePipes(
    new ValidationPipe({ transform: true }),
    new TodoDateValidationPipe(),
  )
  @ApiCreatedResponse({ description: SUCCESS_MESSAGES.TODO_CREATED })
  @ApiBody({ type: CreateTodoDto })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BAD_REQUEST })
  async createTo(
    @Body() createTodoDto: CreateTodoDto,
    @Res() response: Response,
  ) {
    return await this.todoService.createTodo(createTodoDto, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.LIST_TODO))
  @Post("/list")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ description: SUCCESS_MESSAGES.TODO_LIST })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BAD_REQUEST })
  @ApiBody({ type: FilterRequestDTO })
  async viewList(
    @Res() response: Response,
    @Body() filterRequestDTO: FilterRequestDTO,
  ) {
    return await this.todoService.viewListTodo(filterRequestDTO, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.UPDATE_TODO))
  @Patch("/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: UpdateTodoDto })
  @ApiOkResponse({ description: "Updated Sucessfulyy" })
  async updateTodo(
    @Body() updateTodo: UpdateTodoDto,
    @Param("id") id: string,
    @Res() response: Response,
  ) {
    return await this.todoService.updateTodo(id, updateTodo, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.GET_TODO))
  @Get("/:id")
  @ApiOkResponse({ description: "Get sucessfully" })
  async todoGetById(@Res() response: Response, @Param("id") id: string) {
    return await this.todoService.getTodoById(id, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.DELETE_TODO))
  @Delete("/:id")
  @ApiOkResponse({ description: "Delete todo sucessfully" })
  async deleteTodoById(@Res() response: Response, @Param("id") id: string) {
    return await this.todoService.deleteTodoById(id, response);
  }
}
