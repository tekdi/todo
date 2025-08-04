import { Response } from "express";
import { BookmarkCreateDto } from "src/modules/bookmark/dto/bookmark-create.dto";

export interface IBookmarkServicelocator {
  createBookmark(
    bookmarkDto: BookmarkCreateDto,
    createdBy: string,
    response: Response
  ): Promise<void>;

  getAllBookmarksByUserIdAndentityType(
    userId: string,
    entityType: string,
    response: Response
  ): Promise<void>;
} 