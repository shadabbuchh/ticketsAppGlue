// Barrel file for schema exports
// Add your schema exports here as you create them

export * from './users.schema';
export * from './tickets.schema';

// Example:
// export * from './products';
// export * from './orders';

// Export empty schema object to satisfy TypeScript imports
// This will be replaced with actual schema exports when real entities are added
export const schema = {} as const;
