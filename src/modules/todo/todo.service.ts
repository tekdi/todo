import { BadRequestException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { Response } from "express";
import { API_ID, ERROR_MESSAGES } from "src/common/utils/constants.util";
import APIResponse from "src/common/utils/response";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entity/todo.entity";
import { Repository } from "typeorm";
import { FilterRequestDTO } from "./dto/list-todo.dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) { }

  async createTodo(createTodoDto: CreateTodoDto, response: Response) {
    const apiId = API_ID.CREATE_TODO;
    if (createTodoDto?.action_data?.action_name) {
      const result = await this.checkExistingRequest(
        createTodoDto.assigned_by,
        createTodoDto.context_id,
        createTodoDto.action_data.action_name,
      );
      if (result) {
        throw new BadRequestException(
          ERROR_MESSAGES.REQUESTED,
        );
      }
    }
    const save = await this.todoRepository.save(createTodoDto);
    return response
      .status(HttpStatus.CREATED)
      .json(APIResponse.success(apiId, save, "CREATED"));
  }
  async checkExistingRequest(
    assigned_by: string,
    context_id: string,
    action_name: string,
  ) {
    const result = await this.todoRepository
      .createQueryBuilder("todo")
      .where("todo.assigned_by = :assigned_by", { assigned_by })
      .andWhere("todo.context_id = :context_id", { context_id })
      .andWhere("todo.action_data->>'action_name' = :action_name", {
        action_name,
      })
      .andWhere("todo.status = :status", { status: "incomplete" })
      .getOne();
    return result;
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
      finalQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Set default limit and offset if not provided
    const limit = filterRequestDTO.limit ? filterRequestDTO.limit : 200;
    const offset = filterRequestDTO.offset ? filterRequestDTO.offset : 0;

    // Append LIMIT and OFFSET to the query
    finalQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await this.todoRepository.query(finalQuery, queryParams);
    const totalCount = result[0]?.total_count;
    if (result.length === 0) {
      throw new NotFoundException(ERROR_MESSAGES.TODO_NOT_FOUND)
    }
    return response
      .status(HttpStatus.OK)
      .json(APIResponse.success(apiId, { totalCount, result }, "OK"));
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
      queryParams.push('publish');
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
      whereClauses.push(`todo.action_data ->> 'action_name' = $${whereClauses.length + 1}`);
      queryParams.push(filters.action_name);
    }
    if (filters.due_date?.from && filters.due_date?.to) {
      whereClauses.push(`todo.due_date AT TIME ZONE 'UTC' BETWEEN $${whereClauses.length + 1} AND $${whereClauses.length + 2}`);
      queryParams.push(filters.due_date.from);
      queryParams.push(filters.due_date.to);
    }
    return { whereClauses, queryParams };
  }
}
