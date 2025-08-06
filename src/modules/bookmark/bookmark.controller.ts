import {
  Controller,
  Post,
  Body,
  SerializeOptions,
  Res,
  UseFilters,
  Query,
  Get,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from "@nestjs/swagger";

import { BookmarkService } from "./bookmark.service";
import { BookmarkCreateDto } from "./dto/bookmark-create.dto";
import { GetBookmarksDto } from "./dto/get-bookmarks.dto";
import { Response } from "express";
import { AllExceptionsFilter } from "src/common/utils/exception.filter";
import { API_ID, ERROR_MESSAGES, SUCCESS_MESSAGES } from "src/common/utils/constants.util";

@ApiTags("Bookmark")
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  // Get all bookmarks
  @UseFilters(new AllExceptionsFilter(API_ID.BOOKMARK_GET))
  @Get("/read")
  @UsePipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }))
  @ApiOkResponse({ description: "Bookmarks retrieved successfully" })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @SerializeOptions({ strategy: "excludeAll" })
  public async getAllBookmarks(
    @Query() getBookmarksDto: GetBookmarksDto,
    @Res() response: Response
  ) {
    await this.bookmarkService.getAllBookmarksByUserIdAndentityType(getBookmarksDto.userId, getBookmarksDto.entityType, response);
  }

  // Create or Remove bookmark
  @UseFilters(new AllExceptionsFilter(API_ID.BOOKMARK_CREATE))
  @Post("/create")
  @UsePipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }))
  @ApiCreatedResponse({ description: SUCCESS_MESSAGES.BOOKMARK_CREATED })
  @ApiOkResponse({ description: "Bookmark already exists or removed successfully" })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
  @SerializeOptions({ strategy: "excludeAll" })
  public async createBookmark(
    @Body() bookmarkCreateDto: BookmarkCreateDto,
    @Res() response: Response
  ) {
    await this.bookmarkService.createBookmark(bookmarkCreateDto, bookmarkCreateDto.userId, response);
  }
} 