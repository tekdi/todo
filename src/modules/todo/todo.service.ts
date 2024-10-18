import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { Response } from "express";
import { API_ID, ERROR_MESSAGES } from "src/common/utils/constants.util";
import APIResponse from "src/common/utils/response";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entity/todo.entity";
import { Not, Repository } from "typeorm";
import { FilterRequestDTO } from "./dto/list-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { LoggerUtil } from "src/common/logger/LoggerUtil";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) { }

  async createTodo(createTodoDto: CreateTodoDto, response: Response) {
    const apiId = API_ID.CREATE_TODO;
    if (createTodoDto?.action_data?.action_name) {
      const existTodo = await this.checkExistingRequest(
        createTodoDto.assigned_by,
        createTodoDto.context_id,
        createTodoDto.action_data.action_name,
      );
      if (existTodo) {
        throw new BadRequestException(ERROR_MESSAGES.REQUESTED);
      }
    }

    const saveTodo = await this.todoRepository.save(createTodoDto);
    // Log the success message
    LoggerUtil.log(`Todo item created successfully by ${createTodoDto.assigned_by}  with ID: ${saveTodo.todo_id}`, 'TodoService', '/create/todo');
    return response
      .status(HttpStatus.CREATED)
      .json(APIResponse.success(apiId, saveTodo, "CREATED"));
  }

  async checkExistingRequest(
    assigned_by: string,
    context_id: string,
    action_name: string,
  ) {
    const isExistTodo = await this.todoRepository
      .createQueryBuilder("todo")
      .where("todo.assigned_by = :assigned_by", { assigned_by })
      .andWhere("todo.context_id = :context_id", { context_id })
      .andWhere("todo.action_data->>'action_name' = :action_name", {
        action_name,
      })
      .andWhere("todo.status = :status", { status: "incomplete" })
      .getOne();
    return isExistTodo;
  }
  async viewListTodo(filterRequestDTO: FilterRequestDTO, response: Response) {
    const apiId = API_ID.LIST_TODO;
    const { filters } = filterRequestDTO;
    let finalQuery = `SELECT *,COUNT(*) OVER() AS total_count FROM public."todo"`;
    // Initialize where clauses and query parameters
    let whereClauses: string[] = [];
    let queryParams: any[] = [];
    // Check for filters and construct where clauses
    if (filters && Object.keys(filters).length > 0) {
      const searchQueryResult = await this.createSearchQuery(filters);
      whereClauses = searchQueryResult.whereClauses;
      queryParams = searchQueryResult.queryParams;
    }

    // Combine where clauses if any exist
    if (whereClauses.length > 0) {
      finalQuery += " WHERE " + whereClauses.join(" AND ");
    }

    // Set default limit and offset if not provided
    const limit = filterRequestDTO.limit ? filterRequestDTO.limit : 200;
    const offset = filterRequestDTO.offset ? filterRequestDTO.offset : 0;

    // Append LIMIT and OFFSET to the query
    finalQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    const fecthTodo = await this.todoRepository.query(finalQuery, queryParams);
    const totalCount = fecthTodo[0]?.total_count;
    if (fecthTodo.length === 0) {
      throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND);
    }
    LoggerUtil.log(
      `Successfully fetched todos`,
      'TodoService',
      '/todo/list',
      'info'
    );
    return response
      .status(HttpStatus.OK)
      .json(APIResponse.success(apiId, { totalCount, fecthTodo }, "OK"));
  }

  async createSearchQuery(filters) {
    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (filters.assigned_by) {
      whereClauses.push(`todo.assigned_by = $${whereClauses.length + 1}`);
      queryParams.push(filters.assigned_by);
    }
    if (filters.assigned_to) {
      whereClauses.push(`todo.assigned_to = $${whereClauses.length + 1}`);
      queryParams.push(filters.assigned_to);
    }
    if (filters.context_id) {
      whereClauses.push(`todo.context_id = $${whereClauses.length + 1}`);
      queryParams.push(filters.context_id);
    }
    if (filters.status && filters.status.length > 0) {
      whereClauses.push(`todo.status = ANY($${whereClauses.length + 1})`);
      queryParams.push(filters.status);
    }

    if (filters.state) {
      whereClauses.push(`todo.state = $${whereClauses.length + 1}`);
      queryParams.push(filters.state);
    } else {
      whereClauses.push(`todo.state = $${whereClauses.length + 1}`);
      queryParams.push("publish");
    }

    if (filters.context) {
      whereClauses.push(`todo.context = $${whereClauses.length + 1}`);
      queryParams.push(filters.context);
    }

    if (filters.title) {
      whereClauses.push(`todo.title ILIKE $${whereClauses.length + 1}`);
      queryParams.push(`%${filters.title}%`);
    }
    if (filters.action_name) {
      whereClauses.push(
        `todo.action_data ->> 'action_name' = $${whereClauses.length + 1}`,
      );
      queryParams.push(filters.action_name);
    }
    if (filters.due_date?.from && filters.due_date?.to) {
      whereClauses.push(
        `todo.due_date AT TIME ZONE 'UTC' BETWEEN $${whereClauses.length + 1} AND $${whereClauses.length + 2}`,
      );
      queryParams.push(filters.due_date.from);
      queryParams.push(filters.due_date.to);
    }
    return { whereClauses, queryParams };
  }

  async updateTodo(id: string, updateTodoDto, response) {
    const apiId = API_ID.UPDATE_TODO;
    const todoItem = await this.todoRepository.findOne({ where: { todo_id: id } });

    if (!todoItem) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    if (todoItem.status === "archived") {
      throw new NotFoundException(ERROR_MESSAGES.TODO_ARCHIVED);
    }
    const actionKeys = [
      "sender_msg",
      "context_id",
      "context",
      "assigned_to",
      "start_date",
      "due_date",
      "title",
      "type",
      "ideal_time",
      "spent_time",
    ];
    const isActionFieldPresent = actionKeys.some((key) => key in updateTodoDto);

    if (isActionFieldPresent) {
      if (todoItem.status !== "incomplete") {
        throw new BadRequestException(ERROR_MESSAGES.TODO_NOT_INCOMPLETE);
      }
      this.checkAuthorization(updateTodoDto.updated_by, todoItem.assigned_by);
      this.updateTodoFields(todoItem, updateTodoDto);
    }

    if (updateTodoDto.status) {
      this.validateStatusUpdate(todoItem, updateTodoDto.updated_by);

      if (updateTodoDto.status === "rejected") {
        todoItem.status = "rejected";
      } else if (updateTodoDto.status === "completed") {
        todoItem.status = "completed";
      }
    }
    todoItem.completion_date = new Date();
    await this.todoRepository.save(todoItem);
    LoggerUtil.log(
      `Todo with ID ${id} updated successfully`,
      'TodoService',
      `Updated By: ${updateTodoDto.updated_by}`,
      'info');
    return response
      .status(HttpStatus.OK)
      .json(APIResponse.success(apiId, updateTodoDto, "OK"));
  }

  // Method to check authorization
  checkAuthorization(updatedBy: string, assignedBy: string) {
    if (updatedBy !== assignedBy) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
  }

  // Method to update the fields of the
  updateTodoFields(todo: Todo, updateTodoDto: UpdateTodoDto) {
    Object.keys(updateTodoDto).forEach((key) => {
      if (key in todo) {
        todo[key] = updateTodoDto[key] || todo[key];
      }
    });
  }

  // Method to validate status updates
  private validateStatusUpdate(todo: Todo, updatedBy: string) {
    if (todo.due_date && new Date(todo.due_date) < new Date()) {
      throw new BadRequestException(ERROR_MESSAGES.TODO_DUEDATE);
    }

    if (new Date(todo.start_date) > new Date()) {
      throw new BadRequestException(ERROR_MESSAGES.TODO_STARTDATE);
    }
    if (updatedBy !== todo.assigned_to) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
  }

  async getTodoById(todo_id: string, response) {
    const apiId = API_ID.GET_TODO;
    const todoItem = await this.todoRepository.findOne({
      where: { todo_id: todo_id, state: Not("archived") },
    });
    if (!todoItem) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    LoggerUtil.log(
      `Fetched Todo with ID ${todo_id} successfully`,
      'TodoService',
      '/todo/getById',
      'info'
    );
    return response
      .status(HttpStatus.OK)
      .json(APIResponse.success(apiId, todoItem, "OK"));
  }

  async deleteTodoById(todo_id: string, response) {
    const apiId = API_ID.DELETE_TODO;
    const todoItem = await this.todoRepository.findOne({
      where: { todo_id, state: Not("archived") },
    });
    if (!todoItem) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const updateStatus = await this.todoRepository.update(
      {
        todo_id,
      },
      { state: "archived" },
    );
    LoggerUtil.log(
      `Archived Todo with ID ${todo_id} successfully`,
      'TodoService',
      '/todo/delete',
      'info'
    );
    return response
      .status(HttpStatus.OK)
      .json(APIResponse.success(apiId, updateStatus, "OK"));
  }
}
