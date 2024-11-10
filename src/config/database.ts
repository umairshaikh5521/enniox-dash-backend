import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "./environment";
import logger from "../common/utils/logger";

if (!environment.SUPABASE_URL || !environment.SUPABASE_KEY) {
  logger.error("Missing Supabase credentials");
  throw new Error("Missing Supabase credentials");
}

export const supabase: SupabaseClient = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

// Test the connection
const testConnection = async (): Promise<void> => {
  try {
    await supabase.from("users").select("count", { count: "exact" });
    logger.info("Successfully connected to Supabase");
  } catch (error: unknown) {
    logger.error(
      "Failed to connect to Supabase:",
      error instanceof Error ? error.message : String(error)
    );
  }
};

// Execute the connection test
void testConnection();
