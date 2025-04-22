import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hxmsggqsqwkikilwovrt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bXNnZ3FzcXdraWtpbHdvdnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMTEzNzYsImV4cCI6MjA1OTY4NzM3Nn0.ojeaxVocxPWNJwJzAmsEC4VDtCwaRHJtPR24n-UxBZ8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
