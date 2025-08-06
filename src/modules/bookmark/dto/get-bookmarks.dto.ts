import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsUUID,
  IsIn,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ENTITY_TYPES } from "src/common/utils/constants.util";

export class GetBookmarksDto {
  @ApiProperty({
    type: String,
    description: "User ID to get bookmarks for",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  @Expose()
  @IsNotEmpty({ message: "User ID is required" })
  @IsUUID(undefined, { message: "User ID must be a valid UUID" })
  userId: string;

  @ApiProperty({
    type: String,
    description: "Type of entity to filter bookmarks",
    example: "course",
    enum: [ENTITY_TYPES.COURSE, ENTITY_TYPES.CONTENT]
  })
  @Expose()
  @IsNotEmpty({ message: "Entity type is required" })
  @IsIn([ENTITY_TYPES.COURSE, ENTITY_TYPES.CONTENT], { message: "Entity type must be either 'course' or 'content'" })
  entityType: string;

  constructor(partial: Partial<GetBookmarksDto>) {
    Object.assign(this, partial);
  }
} 