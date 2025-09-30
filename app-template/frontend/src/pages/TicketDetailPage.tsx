import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTicket } from '@/hooks';
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

export const TicketDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading, error } = useTicket(id!, { include: 'requester' });

  const handleBackToTickets = () => {
    navigate('/tickets');
  };

  const handleViewRequesterProfile = () => {
    if (ticket?.requesterId) {
      navigate(`/users/${ticket.requesterId}`);
    }
  };

  const handleViewRequesterOrders = () => {
    if (ticket?.requesterId) {
      navigate(`/users/${ticket.requesterId}/orders`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-destructive">
          Error loading ticket: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToTickets}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Ticket Details</h1>
          <p className="text-muted-foreground">
            View ticket information and drill down into requester details
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ticket ID</label>
                <p className="font-mono text-sm mt-1">{ticket.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <p className="text-sm mt-1">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Subject</label>
              <p className="text-lg font-medium mt-1">{ticket.subject}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={STATUS_COLORS[ticket.status]}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <div className="mt-1">
                  <Badge variant={PRIORITY_COLORS[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requester Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Requester ID</label>
              <p className="font-mono text-sm mt-1">{ticket.requesterId}</p>
            </div>

            {ticket.requester && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm mt-1">{ticket.requester.firstName} {ticket.requester.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1">{ticket.requester.email}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleViewRequesterProfile}
              >
                View Requester Profile
              </Button>
              <Button
                variant="outline"
                onClick={handleViewRequesterOrders}
              >
                View Requester Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};