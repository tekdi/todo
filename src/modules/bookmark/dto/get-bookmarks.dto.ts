import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsUUID,
  IsIn,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
    enum: ["course", "content"]
  })
  @Expose()
  @IsNotEmpty({ message: "Entity type is required" })
  @IsIn(["course", "content"], { message: "Entity type must be either 'course' or 'content'" })
  entityType: string;

  constructor(partial: Partial<GetBookmarksDto>) {
    Object.assign(this, partial);
  }
} 