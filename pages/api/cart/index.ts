import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {Cart, CartDTO} from "../../../data/Cart";
import {serialize, CookieSerializeOptions} from 'cookie'
import {CartItem, UpdateCartDTO} from "../../../data/CartItem";

async function createCart(req: NextApiRequest, res: NextApiResponse) {
    const data: CartDTO = req.body
    const supabaseClient = createServerSupabaseClient({req, res})

    const response = await supabaseClient.from("carts")
        .insert([
            {
                "restaurant_id": data.restaurantId
            }
        ])
        .select("id")
        .single()
        .then(({error, data}) => {
            if (error) throw error
            return data
        })

    const cartCookieOptions: CookieSerializeOptions = {
        sameSite: true,
        secure: process.env.NODE_ENV === "production"
    }

    res.setHeader("Set-Cookie", serialize("cartId", response.id.toString(), cartCookieOptions))
    res.status(204).end()
}

async function getCart(req: NextApiRequest, res: NextApiResponse<Cart>) {
    const cartId = req.cookies.cartId

    if (cartId == null) {
        res.status(404).end()
    }

    const client = createServerSupabaseClient({req, res})
    const data: any = await client.from("carts").select("id, total, restaurant:restaurants(id,name, imageURL:image_url)," +
        "items:cart_items(id, quantity, subtotal, menuItem:menu_items(name, description, imageURL:image_url,price))")
        .eq("id", cartId)
        .single()
        .then(({error, data}) => {
            if (error) throw  error
            return data
        })

    res.send(data as unknown as Cart)

}

async function updateCart(req: NextApiRequest, res: NextApiResponse) {
    const cartId = req.cookies.cartId
    const body: UpdateCartDTO = req.body

    if (!cartId) {
        return res.status(403).end()
    }

    const client = createServerSupabaseClient({req, res})
    let cart: Cart

    let result = await client.from("carts").select("id, restaurantId:restaurant_id")
        .eq("id", cartId)
        .single()
        .then(({data, error}) => {
            if (error) throw error
            return data
        })

    const {restaurantId} = result

    if (body.addItem != null) {
        const {menuItemId, quantity} = body.addItem
        const item = await client.from("menu_items").select("id, price")
            .eq("id", menuItemId)
            .eq("restaurant_id", restaurantId)
            .single()
            .then(({data, error}) => {
                if (error) throw error
                return data
            })

        if (item == null) {
            return res.status(400).end()
        }

        await client.from("cart_items").insert({
            menu_item_id: menuItemId,
            cart_id: cartId,
            quantity,
            subtotal: item.price * quantity
        }).then(({error}) => {
            if (error) throw error
        })

        res.status(200).end()
    } else {
        res.status(400).end()
    }
}

const handler: NextApiHandler = async (req, res) => {
    switch (req.method) {
        case "POST":
            return createCart(req, res)
        case "GET":
            return getCart(req, res)
        case "PUT":
            return updateCart(req, res)
            break
        default:
            return res.status(405).end()
    }
}

export default handler