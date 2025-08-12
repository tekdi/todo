import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsUUID,
  Matches,
  IsIn,
  ValidateIf,
  Validate,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsUserIdNotEqualToDoId } from "src/common/utils/custom-validation";
import { BOOKMARK_ACTIONS, ENTITY_TYPES } from "src/common/utils/constants.util";

export class BookmarkCreateDto {
  @ApiProperty({
    type: String,
    description: "User ID who is creating the bookmark",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  @Expose()
  @IsNotEmpty({ message: "User ID is required" })
  @IsUUID(undefined, { message: "User ID must be a valid UUID" })
  userId: string;

  @ApiProperty({
    type: String,
    description: "Type of entity being bookmarked",
    example: "course",
    enum: [ENTITY_TYPES.COURSE, ENTITY_TYPES.CONTENT]
  })
  @Expose()
  @IsNotEmpty({ message: "Entity type is required" })
  @IsIn([ENTITY_TYPES.COURSE, ENTITY_TYPES.CONTENT], { message: "Entity type must be either 'course' or 'content'" })
  entityType: string;

  @ApiProperty({
    type: String,
    description: "Unique identifier for the content",
    example: "do_2143394843223982081867"
  })
  @Expose()
  doId: string;

  @ApiProperty({
    type: String,
    description: "Action to perform",
    example: "add",
    enum: [BOOKMARK_ACTIONS.ADD, BOOKMARK_ACTIONS.REMOVE]
  })
  @Expose()
  @IsNotEmpty({ message: "Action is required" })
  @IsIn([BOOKMARK_ACTIONS.ADD, BOOKMARK_ACTIONS.REMOVE], { message: "Action must be either 'add' or 'remove'" })
  action: string;

  constructor(partial: Partial<BookmarkCreateDto>) {
    Object.assign(this, partial);
  }
} 