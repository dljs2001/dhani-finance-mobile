// This is a placeholder file to prevent import errors
// Since the project is using Supabase, we don't need Firebase functionality
// but there are imports in the code that reference this file

export const db = {
  // Placeholder methods to prevent errors
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async () => {},
      update: async () => {},
    }),
  }),
};