import { eq, and, desc, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tickets, type Ticket } from '../db/schema/tickets.schema';
import { users } from '../db/schema/users.schema';
import type * as schema from '../db/schema';
import type { TicketListItem, TicketListQuery } from '../types/tickets.types';

export const ticketsRepo = (db: NodePgDatabase<typeof schema>) => ({
  /**
   * Fetch a ticket by ID
   */
  async findById(id: string): Promise<Ticket | undefined> {
    const result: Ticket[] = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .limit(1);

    return result[0];
  },

  /**
   * Fetch tickets with requester information
   * Supports filtering by status and priority, and pagination
   */
  async findAllWithRequester(
    query: TicketListQuery
  ): Promise<{ items: TicketListItem[]; total: number }> {
    const { status, priority, limit = 20, offset = 0 } = query;

    // Build where conditions
    const conditions: any[] = [];
    if (status) {
      conditions.push(eq(tickets.status, status));
    }
    if (priority) {
      conditions.push(eq(tickets.priority, priority));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch tickets with requester info
    const result: any[] = await db
      .select({
        id: tickets.id,
        subject: tickets.subject,
        status: tickets.status,
        priority: tickets.priority,
        requesterId: tickets.requesterId,
        requesterEmail: users.email,
        requesterFirstName: users.firstName,
        requesterLastName: users.lastName,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
      })
      .from(tickets)
      .innerJoin(users, eq(tickets.requesterId, users.id))
      .where(whereClause)
      .orderBy(desc(tickets.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult: any[] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(tickets)
      .where(whereClause);

    const total: number = countResult[0]?.count || 0;

    return {
      items: result as TicketListItem[],
      total,
    };
  },

  /**
   * Fetch a ticket by ID with optional requester information
   */
  async findByIdWithRequester(id: string, includeRequester: boolean = false): Promise<any> {
    if (!includeRequester) {
      return await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, id))
        .limit(1)
        .then((result: Ticket[]) => result[0]);
    }

    const result: any[] = await db
      .select({
        id: tickets.id,
        subject: tickets.subject,
        status: tickets.status,
        priority: tickets.priority,
        requesterId: tickets.requesterId,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
        requester: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(tickets)
      .innerJoin(users, eq(tickets.requesterId, users.id))
      .where(eq(tickets.id, id))
      .limit(1);

    return result[0];
  },
});