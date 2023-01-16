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

    const cart = await dbClient.from("carts")
        .select("id, total, restaurantId: restaurant_id, items:cart_items(id, subtotal, quantity, menuItem:menu_items(id,price))")
        .single()
        .then(({data, error}) => {
            if (error) throw error
            return data as any
        })


    const orderItems = cart.items

    const subtotal = cart.total

    const fees = 0
    const taxes = 0

    const total = subtotal + fees + taxes

    const order = await dbClient.from("orders")
        .insert({
            fees,
            taxes,
            restaurant_id: cart.restaurantId,
            cart_id: cartId,
            subtotal,
            total
        }).select("*")
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