import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options as any);
          } catch (err) {
            // Guard: in some environments cookieStore may be read-only or throw
            // swallowing is safe here because cookie sync is best-effort.
            // eslint-disable-next-line no-console
            console.warn("Failed to set cookie in server cookie store", name, err);
          }
        });
      },
    },
  });
}
