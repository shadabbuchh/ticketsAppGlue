import { useQuery } from '@tanstack/react-query';
import { listTickets, getTicket, type ListTicketsParams, type GetTicketParams } from '@/apis/tickets.api';

export const useTickets = (params?: ListTicketsParams) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => listTickets(params),
  });
};

export const useTicket = (id: string, params?: GetTicketParams) => {
  return useQuery({
    queryKey: ['ticket', id, params],
    queryFn: () => getTicket(id, params),
    enabled: !!id,
  });
};