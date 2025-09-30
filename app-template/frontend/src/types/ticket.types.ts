import type { components } from '@app/openapi/generated-types';

export type Ticket = components['schemas']['TicketResponse'];

export type TicketDetail = components['schemas']['TicketDetailResponse'];

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketsListResponse {
  tickets: Ticket[];
  total: number;
}