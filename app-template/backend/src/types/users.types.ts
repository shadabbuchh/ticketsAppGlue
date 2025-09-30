import type { User } from '../db/schema/users.schema';

/**
 * DTO for updating user details
 */
export type UpdateUserDTO = {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
};

/**
 * User response type for API responses
 */
export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};