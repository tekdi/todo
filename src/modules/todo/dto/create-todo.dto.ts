import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsDateString,
  IsOptional,
  IsObject,
  ValidateIf,
  ValidateNested,
  IsEnum,
  IsArray,
} from "class-validator";
import { ACTIONTYPE, CONTEXT, STATE, TYPE } from "src/common/utils/types";

export class ActionDataDto {
  // Conditional validation for REASSIGN action_name
  @ValidateIf((o) => o.action_name === "reassign")
  @IsNotEmpty({
    message: "oldCohortId is required when action_name is reassign",
  })
  @IsUUID("4", { each: true })
  @IsArray()
  @ApiProperty({
    description: "Old Cohort ID (required if action_name is reassign)",
    example: [
      "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea3",
      "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea4",
    ],
    isArray: true,
  })
  oldCohortId?: string[];

  @ValidateIf((o) => o.action_name === "reassign")
  @IsNotEmpty({
    message: "newCohortId is required when action_name is reassign",
  })
  @IsArray()
  @IsUUID("4", { each: true })
  @ApiProperty({
    description: "New Cohort ID (required if action_name is reassign)",
    example: [
      "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea2",
      "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea3",
    ],
    isArray: true,
  })
  newCohortId?: string[];

  // Conditional validation for DELETE action_name
  @ValidateIf((o) => o.action_name === "delete")
  @IsNotEmpty({ message: "status is required when action_name is DELETE" })
  @IsString()
  @ApiProperty({
    description: "Status required if action_name is delete)",
    example: "archived",
  })
  status?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ACTIONTYPE, { message: "Action must be reassign,delete" })
  @ApiProperty({
    description: "action_name",
    example: "reassign",
  })
  action_name: string;
}

export class CreateTodoDto {
  @ApiProperty({
    description: "assigned_by",
    example: "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea2",
  })
  @IsUUID()
  @IsNotEmpty()
  assigned_by: string;

  @ApiProperty({
    description: "assigned_to",
    example: "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea2",
  })
  @IsUUID()
  @IsNotEmpty()
  assigned_to: string;

  @ApiProperty({
    description: "sender_msg",
    example:
      "Mahima Shastri requested to re-assign Aisha Bhatt learning Center from: Koradi -> Khapari Dharmu",
  })
  @IsString()
  @IsNotEmpty()
  sender_msg: string;

  @ApiProperty({
    description: "context_id",
    example: "2e4e9f76-d36c-4281-a65a-eaa3c8b6fea2",
  })
  @IsUUID()
  @IsNotEmpty()
  context_id: string;

  @ApiProperty({ description: "context", example: "cohort" })
  @IsEnum(CONTEXT, { message: "context should be cohort or user" })
  @IsString()
  @IsNotEmpty()
  context: string;

  @ApiProperty({ description: "start_date", example: "2024-03-18T10:00:00Z" })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ description: "due_date", example: "2024-03-18T10:00:00Z" })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsString()
  @IsOptional()
  ideal_time?: string;

  @ApiProperty({ description: "state", example: "publish" })
  @IsEnum(STATE, { message: "state should be publish , unpublish" })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: "title", example: "Reassign" })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: "type", example: "assign" })
  @IsEnum(TYPE, { message: "Type should be self or assign" })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    type: ActionDataDto,
    description: "actionData",
    example: {
      action_name: "reassign",
      oldCohotId: ["2e4e9f76-d36c-4281-a65a-eaa3c8b6fea2"],
      newCohortId: ["2e4e9f76-d36c-4281-a65a-eaa3c8b6fea3"],
    },
  })
  @IsObject()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ActionDataDto)
  action_data: ActionDataDto;

  @ApiProperty({
    type: String,
    description: "createdBy",
    example: "eff008a8-2573-466d-b877-fddf6a4fc13e",
  })
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({
    type: String,
    description: "updatedBy",
    example: "eff008a8-2573-466d-b877-fddf6a4fc13e",
  })
  @IsNotEmpty()
  updatedBy: string;

  createdAt: Date;
  updatedAt: Date;
}
