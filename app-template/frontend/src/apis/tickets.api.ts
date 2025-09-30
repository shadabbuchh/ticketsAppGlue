import { get } from './client';

export interface ListTicketsParams {
  status?: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  limit?: number;
  offset?: number;
}

export const listTickets = async (params?: ListTicketsParams) => {
  const { data, error } = await get('/tickets', {
    params: {
      query: params,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export interface GetTicketParams {
  include?: 'requester';
}

export const getTicket = async (id: string, params?: GetTicketParams) => {
  const { data, error } = await get('/tickets/{id}', {
    params: {
      path: { id },
      query: params,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};