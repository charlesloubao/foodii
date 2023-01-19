import {NextApiHandler} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";

export function withUserSignedIn<T>(handler: NextApiHandler<T>): NextApiHandler<T> {
    return async function wrapped(req, res) {
        const supabaseClient = createServerSupabaseClient({req, res})
        const {data: {user}} = await supabaseClient.auth.getUser()

        if (user == null) {
            return res.status(401).end()
        }

        return handler(req, res)
    }
}