import dotenv from 'dotenv'
import {SupabaseClient} from "@supabase/supabase-js";

dotenv.config()

const supabaseClient = new SupabaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVER_ROLE_KEY!)


function processOrder(order: any) {
    console.log("New order", order.id)
    setTimeout(() => {
        return supabaseClient.from("orders")
            .update({status: "out_for_delivery"})
            .eq("id", order.id)
            .then(({error}) => {
                if(error) throw error
            })
    }, 60000)

    setTimeout(() => {
        return supabaseClient.from("orders")
            .update({status: "delivered"})
            .eq("id", order.id)
            .then(({error}) => {
                if(error) throw error
            })
    }, 60000)
}

supabaseClient.channel(`*`)
    .on("postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "orders",
        },
        (event) => {
            const order = event.new
            processOrder(order)
        }).subscribe((status, err) => {
    if (err) throw err
    console.log({status})
})
