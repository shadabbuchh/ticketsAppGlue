import type { FastifyInstance } from 'fastify';
import { ticketsRepo } from '../repositories/tickets.repo';
import type { TicketListQuery, TicketListResponse } from '../types/tickets.types';

export const makeTicketsService = (app: FastifyInstance) => {
  const repo = ticketsRepo(app.db);

  return {
    /**
     * Get list of tickets with requester information
     * Supports filtering by status and priority, and pagination
     */
    async listTickets(query: TicketListQuery): Promise<TicketListResponse> {
      const { items, total } = await repo.findAllWithRequester(query);

      return {
        tickets: items.map((item: any) => ({
          id: item.id,
          subject: item.subject,
          status: item.status,
          priority: item.priority,
          requesterId: item.requesterId,
          requesterEmail: item.requesterEmail,
          requesterFirstName: item.requesterFirstName,
          requesterLastName: item.requesterLastName,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        total,
      };
    },

    /**
     * Get ticket by ID with optional requester information
     */
    async getTicket(id: string, includeRequester: boolean = false): Promise<any> {
      const ticket: any = await repo.findByIdWithRequester(id, includeRequester);

      if (!ticket) {
        return null;
      }

      return ticket;
    },
  };
};

export type TicketsService = ReturnType<typeof makeTicketsService>;