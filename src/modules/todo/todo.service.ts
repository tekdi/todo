import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { Response } from "express";
import { API_ID, ERROR_MESSAGES } from "src/common/utils/constants.util";
import APIResponse from "src/common/utils/response";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entity/todo.entity";
import { Repository } from "typeorm";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) { }

  async createTodo(createTodoDto: CreateTodoDto, response: Response) {
    const apiId = API_ID.CREATE_TODO;
    createTodoDto.created_at = new Date();
    createTodoDto.updated_at = new Date();
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
}
