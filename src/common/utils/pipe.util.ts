import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class TodoDateValidationPipe implements PipeTransform {
  transform(createTodoDto: any) {
    const currentDate = new Date();
    const startDate = createTodoDto.start_date
      ? new Date(createTodoDto.start_date)
      : null;
    const dueDate = createTodoDto.due_date
      ? new Date(createTodoDto.due_date)
      : null;

    // Check for invalid start date or due date (should be greater than current date)
    if (startDate && startDate <= currentDate) {
      throw new BadRequestException(
        "Start date must be greater than the current date and time",
      );
    }

    if (dueDate && dueDate <= currentDate) {
      throw new BadRequestException(
        "Due date must be greater than the current date and time",
      );
    }

    // Check if the due date is before the start date
    if (startDate && dueDate && dueDate < startDate) {
      throw new BadRequestException(
        "Due date cannot be earlier than start date",
      );
    }
    return createTodoDto;
  }
}
