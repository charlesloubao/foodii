import {NextApiHandler} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {Cart} from "../../data/Cart";
import {CartItem} from "../../data/CartItem";
import {serialize} from "cookie";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res.status(405).end()
    const cartId = req.cookies.cartId

    if (cartId == null) return res.status(403).end()

    const dbClient = createServerSupabaseClient({req, res})

    const cart: Cart = await dbClient.from("carts")
        .select("id, subtotal, restaurantId: restaurant_id, items:cart_items(id, quantity, menuItem:menu_items(id,price))")
        .eq("id", cartId)
        .single()
        .then(({data, error}) => {
            if (error) throw error
            return data as any
        })

    const fees = 0
    const taxes = 0


    const order = await dbClient.from("orders")
        .insert({
            fees,
            taxes,
            subtotal: cart.subtotal,
            restaurant_id: cart.restaurantId!,
            cart_id: cartId,
            status: "received"
        }).select()
        .single()
        .then(({error, data}) => {
            if (error) throw error
            return data
        })

    res.setHeader("Set-Cookie", serialize("cartId", "", {
        maxAge: 0
    }))
    res.send(order)
}

export default handler