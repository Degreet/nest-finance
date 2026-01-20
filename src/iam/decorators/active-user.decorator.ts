import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import type { Request } from 'express';

/**
 * Decorator to extract the active user data from the request.
 * @param field - Optional field name to extract a specific property from ActiveUserData.
 * @returns The entire ActiveUserData object or a specific field if provided.
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
