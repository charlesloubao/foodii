import {NextApiHandler} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {Cart} from "../../data/Cart";
import {CartItem} from "../../data/CartItem";
import {serialize} from "cookie";
import {createAdminSupabaseClient} from "../../lib/supabaseUtils";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res.status(405).end()

    const dbClient = createServerSupabaseClient({req, res})

    const {data: {user}} = await dbClient.auth.getUser()

    if (user == null) return res.status(403).end()

    const cart: Cart = await dbClient.from("carts")
        .select("id, subtotal, restaurantId: restaurant_id, items:cart_items(id, quantity, menuItem:menu_items(id,price))")
        .match({"user_id": user!.id, pending: true})
        .maybeSingle()
        .then(({data, error}) => {
            if (error) throw error
            return data as any
        })

    const fees = 0
    const taxes = 0

    const {address, phoneNumber, instructions} = req.body

    const order = await dbClient.from("orders")
        .insert({
            fees,
            taxes,
            subtotal: cart.subtotal,
            restaurant_id: cart.restaurantId!,
            cart_id: cart.id,
            status: "received",
            user_id: user.id,
            address,
            phone_number: phoneNumber,
            instructions: instructions
        }).select()
        .single()
        .then(({error, data}) => {
            if (error) throw error
            return data
        })

    await createAdminSupabaseClient().from("carts").update({
        pending: false
    }).eq("id", cart.id).then(({data, error}) => {
        if (error) throw error
    })

    res.send(order)
}

export default handler