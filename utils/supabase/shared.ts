import type { SupabaseClient } from "@supabase/supabase-js";

const emptySession = {
  data: { session: null },
  error: null,
};

const emptyUser = {
  data: { user: null },
  error: null,
};

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createFallbackSupabaseClient(): SupabaseClient {
  return {
    auth: {
      getSession: async () => emptySession,
      getUser: async () => emptyUser,
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signInWithOtp: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      exchangeCodeForSession: async () => ({ data: null, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => ({ data: [], error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          single: async () => ({ data: null, error: null }),
        }),
        order: async () => ({ data: [], error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        single: async () => ({ data: null, error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
    rpc: async () => ({ data: null, error: null }),
  } as unknown as SupabaseClient;
}