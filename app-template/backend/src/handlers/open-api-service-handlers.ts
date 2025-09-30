import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Services } from '../services/index';
import type { components } from '../../../openapi/generated-types';

/**
 * OpenAPI operation handlers for fastify-openapi-glue
 *
 * Maps OpenAPI operationIds to service method calls.
 * Extend this class to add handlers for new entities.
 *
 * 🚨 CRITICAL: This is the ONLY place to implement business API handlers.
 * NEVER create manual route files (src/routes/*.route.ts) for business endpoints.
 * All business routes are auto-generated from OpenAPI spec.
 */
export class OpenAPIServiceHandlers {
  protected services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  /**
   * Register a new user
   * operationId: registerUser
   */
  async registerUser(
    request: FastifyRequest<{
      Body: components["schemas"]["RegisterUserRequest"];
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, firstName, lastName } = request.body;
      const user: components["schemas"]["UserResponse"] = await this.services.users.registerUser({
        email,
        firstName,
        lastName,
      });
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return reply.status(409).send({
          code: 'CONFLICT',
          message: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * List tickets with optional filters
   * operationId: listTickets
   */
  async listTickets(
    request: FastifyRequest<{
      Querystring: {
        status?: string;
        priority?: string;
        limit?: number;
        offset?: number;
      };
    }>,
    reply: FastifyReply
  ) {
    const { status, priority, limit, offset } = request.query;
    const result: any = await this.services.tickets.listTickets({
      status,
      priority,
      limit,
      offset,
    });
    return reply.status(200).send(result);
  }

  /**
   * Get ticket by ID
   * operationId: getTicket
   */
  async getTicket(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
      Querystring: {
        include?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { include } = request.query;

    const includeRequester: boolean = include === 'requester';
    const ticket: any = await this.services.tickets.getTicket(id, includeRequester);

    if (!ticket) {
      return reply.status(404).send({
        code: 'NOT_FOUND',
        message: 'Ticket not found',
      });
    }

    return reply.status(200).send(ticket);
  }

  /**
   * Get user by ID
   * operationId: getUser
   */
  async getUser(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const user: any = await this.services.users.getUserById(id);

    if (!user) {
      return reply.status(404).send({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return reply.status(200).send(user);
  }
}
