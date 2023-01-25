import {withUserSignedIn} from "../../middleware/withUserSignedIn";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {Order} from "../../data/Order";

export default withUserSignedIn(async (req, res) => {
    if (req.method !== "GET") return res.status(405).end()

    const supabaseClient = createServerSupabaseClient({req, res})

    const {data: {user}} = await supabaseClient.auth.getUser()

    const orders: any = await supabaseClient.rpc('user_orders', {
        uid: user!.id
    }).select(`id,
                       createdAt:created_at,
                       total,
                       status,
                       itemsCount:items_count,
                       restaurant,
                       inProgress:in_progress`)
        .then(({error, data}) => {
            if (error) throw error
            return data
        })

    res.json(orders)
})
