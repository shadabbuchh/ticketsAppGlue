import type { Ticket } from '../db/schema/tickets.schema';

/**
 * Ticket list item with requester information
 */
export type TicketListItem = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  requesterId: string;
  requesterEmail: string;
  requesterFirstName: string;
  requesterLastName: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Ticket list query parameters
 */
export type TicketListQuery = {
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
};

/**
 * Ticket list response
 */
export type TicketListResponse = {
  tickets: TicketListItem[];
  total: number;
};