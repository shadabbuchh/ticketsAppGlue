// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// ⚠️  THIS IS AN EXAMPLE FILE - DO NOT USE DIRECTLY IN CODE ⚠️
// This file serves as a reference for creating new plugins
//
// TEMPLATE  –  Plugin factory for <Plugin>
// To create a new plugin:
//   1. Create a new file (e.g., custom.plugin.ts)
//   2. Implement your plugin factory function
//   3. Add plugin configuration and methods as needed
//   4. Register it in your application

/*
import type { FastifyInstance } from 'fastify';

export const __plugin__Plugin = (app: FastifyInstance) => {
  // Plugin initialization logic here
  const pluginConfig = {
    // Plugin-specific configuration
  };

  // Initialize immediately during construction (like repositories/services)
  app.decorate('__plugin__', {
    // Plugin methods/properties to add to FastifyInstance
    method1: () => 'Hello from __plugin__',
    method2: (data: unknown) => ({ processed: data }),
  });

  // Add hooks if needed
  app.addHook('preHandler', async (_request, _reply) => {
    // Plugin-specific request processing
  });

  return {
    name: '__plugin__',
    config: pluginConfig,

    // Additional plugin methods
    getConfig: () => pluginConfig,
    isEnabled: () => true,

    // Note: Use app.addHook('onClose', ...) above for cleanup instead of close() method
  };
};

export type __plugin__Plugin = ReturnType<typeof __plugin__Plugin>;
*/
