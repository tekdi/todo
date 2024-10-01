import {
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
  IsEnum,
  ValidateIf,
  IsNotEmpty,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CONTEXT, STATUS, TYPE } from "src/common/utils/types";

export class UpdateTodoDto {
  @ApiProperty({
    description: "sender_msg",
    example:
      "Mahima Shastri requested to re-assign Aisha Bhatt learning Center from: Koradi -> Khapari Dharmu",
  })
  @IsOptional()
  @IsString()
  sender_msg?: string;

  @ApiProperty({
    description: "ID of the associated context",
    example: "eff008a8-2573-466d-b877-fddf6a4fc13e",
  })
  @IsOptional()
  @IsUUID()
  @IsString()
  context_id?: string;

  @ApiProperty({
    description: "Context ",
    example: "user",
  })
  @IsOptional()
  @IsString()
  @IsEnum(CONTEXT, {
    each: true,
    message: "Context must be one of: user,cohort",
  })
  context?: string;

  @ApiProperty({
    description: "UUID of the user to whom the task is assigned",
    example: "eff008a8-2573-466d-b877-fddf6a4fc13e",
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  assigned_to?: string;

  @ApiProperty({
    description: "The start date of the Todo task",
    example: "2024-09-25T19:00:00Z",
  })
  @IsOptional()
  @IsDate()
  start_date?: Date;

  @ApiProperty({
    description: "The due date for the Todo task",
    example: "2024-09-25T19:00:00Z",
  })
  @IsOptional()
  @IsDate()
  due_date?: Date;

  @ApiProperty({
    description: "status of the Todo task (e.g, completed, rejected)",
    example: "completed",
  })
  @IsOptional()
  @IsEnum(STATUS, {
    each: true,
    message: "Status must be one of: completed,rejected",
  })
  @IsString()
  status?: string;

  @ApiProperty({
    description: "The title of the Todo task",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "The type of the Todo task",
    example: "self",
  })
  @IsEnum(TYPE, { message: "Type must be one of: self,assign" })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: "The ideal time for completing the task",
    example: "02:00:00",
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: "Ideal time must be in the format HH:MM:SS",
  })
  ideal_time?: string;

  @ApiProperty({
    description: "The time spent on the task",
    example: "02:00:00",
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: "Ideal time must be in the format HH:MM:SS",
  })
  spent_time?: string;

  @ApiProperty({
    type: String,
    description: "updatedBy",
    example: "eff008a8-2573-466d-b877-fddf6a4fc13e",
  })
  @IsString()
  updated_by: string;

  @ValidateIf(
    (o) =>
      !o.sender_msg &&
      !o.context_id &&
      !o.context &&
      !o.assigned_to &&
      !o.start_date &&
      !o.due_date &&
      !o.status &&
      !o.type &&
      !o.ideal_time &&
      !o.spent_time,
  )
  @IsNotEmpty({
    message:
      "Please Provide at least one of update field like status or sender_msg.",
  })
  validateFields?: any;
}
