// ---------------------------------------------------------------------------
// repositories/index.ts
// ---------------------------------------------------------------------------
// • This file exports an empty repositories object initially.
// • After you create a real entity (product, order, …):
//     1. Create a new repository file (e.g., product.repo.ts)
//     2. Implement your repository class with database operations
//     3. Import and register it below: `product: productRepo(app.db),`
// ---------------------------------------------------------------------------

import type { FastifyInstance } from 'fastify';

// 1️⃣  Import repository factories here as you create them.
import { usersRepo } from './users.repo';
// import { productRepo } from './product.repo.ts'              // 🡄 real import later
// import { orderRepo }   from './order.repo.ts'

// 2️⃣  Build and return an object where every repo already has app.db injected.
export const buildRepositories = (app: FastifyInstance) => ({
  users: usersRepo(app.db),
  // product: productRepo(app.db),              // 🡄 real entry later
  // order: orderRepo(app.db)
});

// 3️⃣  Helper type — used in src/types/fastify.d.ts for `app.repositories`.
export type Repositories = ReturnType<typeof buildRepositories>;
