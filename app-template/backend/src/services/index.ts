// ---------------------------------------------------------------------------
// services/index.ts
// ---------------------------------------------------------------------------
// • This file exports an empty services object initially.
// • After you create a real entity (product, order, …):
//     1. Create a new service file (e.g., product.service.ts)
//     2. Implement your service class extending BaseService
//     3. Import and register it below: `product: makeProductService(app),`
// ---------------------------------------------------------------------------

import type { FastifyInstance } from 'fastify';

// ⬇️  Import service factories here as you create them
import { makeUsersService } from './users.service';
import { makeTicketsService } from './tickets.service';

export const buildServices = (app: FastifyInstance) => ({
  users: makeUsersService(app),
  tickets: makeTicketsService(app),
  // product: makeProductService(app),
  // order: makeOrderService(app),
});

export type Services = ReturnType<typeof buildServices>;
