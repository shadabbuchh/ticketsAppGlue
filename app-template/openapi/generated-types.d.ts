/**
 * ⚠️  AUTO-GENERATED FILE - DO NOT MODIFY ⚠️
 *
 * This file contains TypeScript types generated from OpenAPI specifications.
 * Use these types for type-safe API development.
 */

export interface paths {
    "/users/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register a new user */
        post: operations["registerUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all tickets */
        get: operations["listTickets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get ticket by ID with optional requester details */
        get: operations["getTicket"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get user by ID */
        get: operations["getUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        RegisterUserRequest: {
            /** Format: email */
            email: string;
            firstName: string;
            lastName: string;
        };
        UserResponse: {
            /** Format: uuid */
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        TicketResponse: {
            /** Format: uuid */
            id: string;
            subject: string;
            /** @enum {string} */
            status: "open" | "in_progress" | "pending" | "resolved" | "closed";
            /** @enum {string} */
            priority: "low" | "medium" | "high" | "urgent";
            /** Format: uuid */
            requesterId: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        TicketDetailResponse: {
            /** Format: uuid */
            id: string;
            subject: string;
            /** @enum {string} */
            status: "open" | "in_progress" | "pending" | "resolved" | "closed";
            /** @enum {string} */
            priority: "low" | "medium" | "high" | "urgent";
            /** Format: uuid */
            requesterId: string;
            requester?: components["schemas"]["UserResponse"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ErrorResponse: {
            code: string;
            message: string;
            details?: string;
            fieldErrors?: {
                field?: string;
                message?: string;
            }[];
        };
    };
    responses: {
        /** @description Invalid request */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Resource not found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Conflict (concurrent update or duplicate) */
        Conflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Validation failed */
        UnprocessableEntity: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    registerUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterUserRequest"];
            };
        };
        responses: {
            /** @description User registered successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            409: components["responses"]["Conflict"];
            422: components["responses"]["UnprocessableEntity"];
        };
    };
    listTickets: {
        parameters: {
            query?: {
                status?: "open" | "in_progress" | "pending" | "resolved" | "closed";
                priority?: "low" | "medium" | "high" | "urgent";
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of tickets */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        tickets: components["schemas"]["TicketResponse"][];
                        total: number;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
        };
    };
    getTicket: {
        parameters: {
            query?: {
                /** @description Include related entities (requester) */
                include?: "requester";
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ticket details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDetailResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
    getUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
}
