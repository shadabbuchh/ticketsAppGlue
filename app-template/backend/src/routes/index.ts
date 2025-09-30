import healthRoutes from './health.route';

/**
 * Route exports
 *
 * 🚨 CRITICAL: Only infrastructure routes are exported here.
 *
 * Health route is kept as a traditional route since it's infrastructure/monitoring,
 * not part of the business API that should be in the OpenAPI specification.
 *
 * Business API routes are handled automatically by fastify-openapi-glue.
 *
 * ❌ NEVER add business route exports here (dashboard, user, product, etc.)
 * ✅ ONLY add infrastructure routes (health, monitoring, etc.)
 */
export { healthRoutes };
