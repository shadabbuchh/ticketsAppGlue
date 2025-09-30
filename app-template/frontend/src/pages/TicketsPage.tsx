import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/hooks';
import type { TicketStatus, TicketPriority } from '@/types';

const STATUS_COLORS: Record<TicketStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  open: 'secondary',
  in_progress: 'default',
  pending: 'outline',
  resolved: 'secondary',
  closed: 'outline',
};

const PRIORITY_COLORS: Record<TicketPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'outline',
  medium: 'secondary',
  high: 'default',
  urgent: 'destructive',
};

export const TicketsPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');

  const queryParams = {
    ...(statusFilter !== 'all' && { status: statusFilter as TicketStatus }),
    ...(priorityFilter !== 'all' && { priority: priorityFilter as TicketPriority }),
  };

  const { data, isLoading, error } = useTickets(queryParams);

  const handleRowClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-destructive">
          Error loading tickets: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <p className="text-muted-foreground">
          View and manage support tickets
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading tickets...
          </div>
        ) : data?.tickets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No tickets found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Requester ID</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  onClick={() => handleRowClick(ticket.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-mono text-xs">
                    {ticket.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[ticket.status]}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={PRIORITY_COLORS[ticket.priority]}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {ticket.requesterId.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.total > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {data.tickets.length} of {data.total} tickets
        </div>
      )}
    </div>
  );
};