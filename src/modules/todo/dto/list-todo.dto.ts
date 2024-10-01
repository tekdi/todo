import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNotEmpty,
} from "class-validator";
import { ACTIONTYPE, CONTEXT, STATE, STATUS } from "src/common/utils/types";

class DueRangeDTO {
  @ApiProperty({
    example: "2024-09-20T18:30:00Z",
    description: "Start of due date range",
  })
  @IsDateString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({
    example: "2024-09-23T18:29:59Z",
    description: "End of due date range",
  })
  @IsDateString()
  @IsNotEmpty()
  to: string;
}

class FiltersDTO {
  @ApiProperty({
    example: "76a5e84a-4336-47c8-986f-98f7ad190e0b",
    description: "assigned_by",
  })
  @IsOptional()
  @IsUUID("4")
  assigned_by?: string;

  @ApiProperty({
    example: "76a5e84a-4336-47c8-986f-98f7ad190e0b",
    description: "assigned_to",
  })
  @IsOptional()
  @IsUUID("4")
  assigned_to?: string;

  @ApiProperty({
    example: "76a5e84a-4336-47c8-986f-98f7ad190e0b",
    description: "context_id",
  })
  @IsOptional()
  @IsUUID("4")
  context_id?: string;

  @ApiProperty({
    example: CONTEXT.USER,
    description: "Array of state values: user,cohort",
    enum: STATE,
  })
  @IsOptional()
  @IsEnum(CONTEXT, {
    each: true,
    message: "context must be one of: user,cohort",
  })
  @IsString()
  context?: string;

  @ApiProperty({
    example: STATE.PUBLISH,
    description: "Array of status values: publish, draft,archived",
    enum: STATE,
  })
  @IsOptional()
  @IsEnum(STATE, {
    each: true,
    message: "state must be one of: publish,draft,archived",
  })
  @IsString()
  state?: string;

  @ApiProperty({ example: "Event Title", description: "Event title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: ACTIONTYPE.REASSIGN,
    description: "The action type to be performed",
    enum: ACTIONTYPE,
  })
  @IsOptional()
  @IsEnum(ACTIONTYPE, {
    each: true,
    message:
      "action_name must be one of the following values: reassign, delete",
  })
  @IsString()
  action_name?: string;

  @ApiProperty({
    example: [STATUS.COMPLETE, STATUS.INCOMPLETE, STATUS.REJECTED],
    description: "Array of status values: completed, incomplete, rejected",
  })
  @IsOptional()
  @IsArray()
  @IsEnum(STATUS, {
    each: true,
    message: "Status must be one of: completed, incomplete, rejected",
  })
  status?: string[];

  @ApiProperty({ type: DueRangeDTO, description: "Due date range filter" })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DueRangeDTO)
  due_date?: DueRangeDTO;
}

export class FilterRequestDTO {
  @ApiProperty({
    type: Number,
    description: "Limit",
  })
  limit: number;

  @ApiProperty({
    type: Number,
    description: "Offset",
  })
  offset: number;

  @ApiProperty({ type: FiltersDTO, description: "Filters for search" })
  @ValidateNested({ each: true })
  @Type(() => FiltersDTO)
  filters: FiltersDTO;
}
