import {createClient, SupabaseClient} from "@supabase/supabase-js";

export function createAdminSupabaseClient(): SupabaseClient {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVER_ROLE_KEY!)
}