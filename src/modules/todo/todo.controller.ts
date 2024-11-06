import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { Response, Request } from "express";
import { AllExceptionsFilter } from "src/common/utils/exception.filter";
import {
  API_ID,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "src/common/utils/constants.util";
import { FilterRequestDTO } from "./dto/list-todo.dto";
import { TodoDateValidationPipe } from "src/common/utils/pipe.util";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { checkValidUserId } from "src/common/utils/custom-validation";

@Controller("todo")
@ApiTags("Todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

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
    @Req() request: Request,
  ) {
    const userId: string = checkValidUserId(request.query.userid);
    return await this.todoService.createTodo(createTodoDto, userId, response);
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
    @Query('userid') userid: string | null
  ) {
    return await this.todoService.viewListTodo(filterRequestDTO, userid, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.UPDATE_TODO))
  @Patch("/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: UpdateTodoDto })
  @ApiOkResponse({ description: SUCCESS_MESSAGES.TODO_UPDATE })
  async updateTodo(
    @Body() updateTodo: UpdateTodoDto,
    @Param("id") id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    const userId: string = checkValidUserId(request.query.userid);
    return await this.todoService.updateTodo(id, updateTodo, userId, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.GET_TODO))
  @Get("/:id")
  @ApiOkResponse({ description: SUCCESS_MESSAGES.TODO_BYID })
  async todoGetById(@Res() response: Response, @Param("id") id: string, @Query('userid') userid: string | null,) {
    return await this.todoService.getTodoById(id, userid, response);
  }

  @UseFilters(new AllExceptionsFilter(API_ID.DELETE_TODO))
  @Delete("/:id")
  @ApiOkResponse({ description: SUCCESS_MESSAGES.TODO_DELETE })
  async deleteTodoById(@Res() response: Response, @Param("id") id: string, @Req() request: Request) {
    const userId: string = checkValidUserId(request.query.userid);
    return await this.todoService.deleteTodoById(id, userId, response);
  }
}
