import type { FastifyInstance } from 'fastify';
import { usersRepo } from '../repositories/users.repo';
import type { UpdateUserDTO, UserResponse } from '../types/users.types';
import type { NewUser, User } from '../db/schema/users.schema';

export const makeUsersService = (app: FastifyInstance) => {
  const repo = usersRepo(app.db);

  return {
    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<UserResponse | null> {
      const user: User | undefined = await repo.findById(id);
      if (!user) {
        return null;
      }
      return this.mapUserToResponse(user);
    },

    /**
     * Get user by email
     */
    async getUserByEmail(email: string): Promise<UserResponse | null> {
      const user: User | undefined = await repo.findByEmail(email);
      if (!user) {
        return null;
      }
      return this.mapUserToResponse(user);
    },

    /**
     * Register a new user
     * Checks if user exists and creates a new user if not
     */
    async registerUser(data: NewUser): Promise<UserResponse> {
      // Check if user already exists
      const existingUser: User | undefined = await repo.findByEmail(data.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user: User = await repo.create(data);
      return this.mapUserToResponse(user);
    },

    /**
     * Update user by ID
     */
    async updateUser(
      id: string,
      data: UpdateUserDTO
    ): Promise<UserResponse | null> {
      const user: User | undefined = await repo.updateById(id, data);
      if (!user) {
        return null;
      }
      return this.mapUserToResponse(user);
    },

    /**
     * Get current user based on the day
     * Returns a deterministic "random" user based on current date
     */
    async getCurrentUser(): Promise<UserResponse | null> {
      // Use current date as seed for deterministic selection
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
      );

      const user: User | undefined = await repo.findRandomBySeed(dayOfYear);
      if (!user) {
        return null;
      }

      return this.mapUserToResponse(user);
    },

    /**
     * Map User entity to UserResponse
     */
    mapUserToResponse(user: User): UserResponse {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    },
  };
};

export type UsersService = ReturnType<typeof makeUsersService>;