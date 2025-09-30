import { Outlet } from 'react-router-dom';
import { Container } from '@/components';

export function AppLayout() {
  return (
    <Container className="min-h-screen bg-background flex flex-col mx-auto">
      <Outlet />
    </Container>
  );
}
