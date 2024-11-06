import { BadRequestException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ERROR_MESSAGES } from "./constants.util";

export const checkValidUserId = (userId: any): string => {
    if (typeof userId !== 'string') {
        throw new BadRequestException(ERROR_MESSAGES.PROVIDE_ONE_USERID_IN_QUERY);
    }
    if (!userId || !isUUID(userId)) {
        throw new BadRequestException(ERROR_MESSAGES.USERID_INVALID);
    }
    return userId;
};