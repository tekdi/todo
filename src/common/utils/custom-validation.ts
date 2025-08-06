import { BadRequestException } from "@nestjs/common";
import { isUUID } from "class-validator";
import { ERROR_MESSAGES } from "./constants.util";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export const checkValidUserId = (userId: any): string => {
    if (typeof userId !== 'string') {
        throw new BadRequestException(ERROR_MESSAGES.PROVIDE_ONE_USERID_IN_QUERY);
    }
    if (!userId || !isUUID(userId)) {
        throw new BadRequestException(ERROR_MESSAGES.USERID_INVALID);
    }
    return userId;
};

@ValidatorConstraint({ name: 'IsUserIdNotEqualToDoId', async: false })
export class IsUserIdNotEqualToDoId implements ValidatorConstraintInterface {
  validate(doId: string, args: ValidationArguments) {
    const object = args.object as any;
    const userId = object.userId;
    
    // Only check if doId matches UUID pattern
    if (doId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return userId !== doId;
    }
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'User ID and Do ID cannot be the same';
  }
}