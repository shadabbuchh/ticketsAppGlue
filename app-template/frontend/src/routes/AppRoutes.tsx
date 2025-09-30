import { Routes, Route } from 'react-router';
import { AppLayout } from '@/components';
import { TicketsPage, TicketDetailPage } from '@/pages';

// The workflow will generate Pages and Routes
export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TicketsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Route>
    </Routes>
  );
};
