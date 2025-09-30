import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject: varchar('subject', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  priority: varchar('priority', { length: 50 }).notNull(),
  requesterId: uuid('requester_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('tickets_status_idx').on(table.status),
  priorityIdx: index('tickets_priority_idx').on(table.priority),
  requesterIdx: index('tickets_requester_id_idx').on(table.requesterId),
  createdAtIdx: index('tickets_created_at_idx').on(table.createdAt),
}));

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;