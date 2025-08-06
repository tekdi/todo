import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Response } from "express";
import { Bookmark } from "./entity/bookmark.entity";
import { BookmarkCreateDto } from "./dto/bookmark-create.dto";
import { LoggerUtil } from "src/common/logger/LoggerUtil";
import APIResponse from "src/common/utils/response";
import { API_ID, ERROR_MESSAGES, BOOKMARK_ACTIONS } from "src/common/utils/constants.util";

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>
  ) {}

  async createBookmark(
    bookmarkDto: BookmarkCreateDto,
    createdBy: string,
    response: Response
  ): Promise<void> {
    try {
      
      if (bookmarkDto.action === BOOKMARK_ACTIONS.ADD) {
        // Check if bookmark already exists (doId is unique across entityTypes)
        const existingBookmark = await this.bookmarkRepository.findOne({
          where: { 
            userId: bookmarkDto.userId, 
            doId: bookmarkDto.doId 
          }
        });

        if (existingBookmark) {
          // Bookmark already exists - return 409 Conflict
          response.status(409).json(
            APIResponse.error(
              API_ID.BOOKMARK_CREATE,
              ERROR_MESSAGES.BOOKMARK_ALREADY_EXISTS,
              "ConflictException",
              "409"
            )
          );
          return;
        }

        // Create new bookmark
        const bookmark = new Bookmark();
        bookmark.userId = bookmarkDto.userId;
        bookmark.entityType = bookmarkDto.entityType;
        bookmark.doId = bookmarkDto.doId;
        bookmark.createdBy = createdBy;

        const savedBookmark = await this.bookmarkRepository.save(bookmark);

        // Return 201 Created for new bookmark
        response.status(201).json(
          APIResponse.success(
            API_ID.BOOKMARK_CREATE,
            savedBookmark,
            "CREATED"
          )
        );
      } else if (bookmarkDto.action === BOOKMARK_ACTIONS.REMOVE) {
        // Find and delete bookmark (doId is unique across entityTypes)
        const bookmark = await this.bookmarkRepository.findOne({
          where: { 
            userId: bookmarkDto.userId, 
            doId: bookmarkDto.doId 
          }
        });

        if (!bookmark) {
          response.status(404).json(
            APIResponse.error(
              API_ID.BOOKMARK_REMOVE,
              ERROR_MESSAGES.BOOKMARK_NOT_FOUND,
              "NotFoundException",
              "404"
            )
          );
          return;
        }

        await this.bookmarkRepository.remove(bookmark);

        response.status(200).json(
          APIResponse.success(
            API_ID.BOOKMARK_REMOVE,
            {
              userId: bookmarkDto.userId,
              entityType: bookmarkDto.entityType,
              doId: bookmarkDto.doId
            },
            "OK"
          )
        );
      }
    } catch (error) {
      LoggerUtil.error("Error handling bookmark action", error);
      
      // Check if it's a unique constraint violation
      if (error.code === '23505' && error.constraint === 'Bookmarks_userId_doId_key') {
        response.status(409).json(
          APIResponse.error(
            API_ID.BOOKMARK_CREATE,
            ERROR_MESSAGES.BOOKMARK_ALREADY_EXISTS,
            "ConflictException",
            "409"
          )
        );
        return;
      }
      
      response.status(500).json(
        APIResponse.error(
          bookmarkDto.action === BOOKMARK_ACTIONS.ADD ? API_ID.BOOKMARK_CREATE : API_ID.BOOKMARK_REMOVE,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          "InternalServerError",
          "500"
        )
      );
    }
  }

  async getAllBookmarksByUserIdAndentityType(
    userId: string,
    entityType: string,
    response: Response
  ): Promise<void> {
    try {
      
      const bookmarks = await this.bookmarkRepository.find({
        where: { 
          userId: userId,
          entityType: entityType
        },
        order: { createdAt: 'DESC' },
        select: ['id', 'userId', 'entityType', 'doId', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy']
      });


      response.status(200).json(
        APIResponse.success(
          API_ID.BOOKMARK_GET,
          {
            bookmarks: bookmarks,
            totalCount: bookmarks.length
          },
          "OK"
        )
      );
    } catch (error) {
      LoggerUtil.error("Error getting bookmarks by user and type", error);
      response.status(500).json(
        APIResponse.error(
          API_ID.BOOKMARK_GET,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          "InternalServerError",
          "500"
        )
      );
    }
  }
} 