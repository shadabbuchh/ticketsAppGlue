import { eq, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users, type User, type NewUser } from '../db/schema/users.schema';
import type * as schema from '../db/schema';

export const usersRepo = (db: NodePgDatabase<typeof schema>) => ({
  /**
   * Fetch a user by their ID
   */
  async findById(id: string): Promise<User | undefined> {
    const result: User[] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0];
  },

  /**
   * Update user details
   */
  async updateById(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<User | undefined> {
    const result: User[] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return result[0];
  },

  /**
   * Create a new user
   */
  async create(data: NewUser): Promise<User> {
    const result: User[] = await db.insert(users).values(data).returning();
    return result[0];
  },

  /**
   * Fetch a user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const result: User[] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0];
  },

  /**
   * Get a random user based on a seed value (deterministic)
   * Uses PostgreSQL's setseed() for reproducible randomness
   */
  async findRandomBySeed(seed: number): Promise<User | undefined> {
    // Normalize seed to be between 0 and 1
    const normalizedSeed = (seed % 1000000) / 1000000;

    const result: User[] = await db
      .select()
      .from(users)
      .orderBy(sql`random()`)
      .limit(1)
      .execute();

    // Set seed before the query for deterministic results
    await db.execute(sql`SELECT setseed(${normalizedSeed})`);

    const seededResult: User[] = await db
      .select()
      .from(users)
      .orderBy(sql`random()`)
      .limit(1);

    return seededResult[0];
  },
});