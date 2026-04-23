"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export const createBrowserSupabaseClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabaseKey);
};
