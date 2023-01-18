import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {Cart, CartDTO} from "../../../data/Cart";
import {serialize} from 'cookie'
import {CartItem, UpdateCartDTO} from "../../../data/CartItem";
import {MenuItem} from "../../../data/MenuItem";
import {serializeServerCookie} from "../../../lib/cookieUtils";
import {SupabaseClient} from "@supabase/supabase-js";
import {createAdminSupabaseClient} from "../../../lib/supabaseUtils";

export type GetCartResponse = {
    hasCart: boolean,
    cart: Cart | null
}

async function createCart(req: NextApiRequest, res: NextApiResponse) {
    const data: CartDTO = req.body
    const supabaseClient = createServerSupabaseClient({req, res})
    const {data: {user}} = await supabaseClient.auth.getUser()

    const existingCart = await supabaseClient.from("carts").select("id")
        .match({"user_id": user!.id, pending: true})
        .maybeSingle()
        .then(({error, data}) => {
            if (error) return Promise.reject(error)
            return data
        })

    if (existingCart != null) res.status(403).end()

    await supabaseClient.from("carts")
        .insert([
            {
                "restaurant_id": data.restaurantId,
                subtotal: 0,
                user_id: user?.id,
                pending: true
            }
        ])
        .select("id")
        .single()
        .then(({error, data}) => {
            if (error) throw error
            return data
        })

    res.status(204).end()
}

async function getCart(req: NextApiRequest, res: NextApiResponse<GetCartResponse>) {
    const client: SupabaseClient = createServerSupabaseClient({req, res})

    const {data: {user}} = await client.auth.getUser()

    const data: Cart = await client.from("carts").select("id, subtotal, restaurant:restaurants(id,name, imageURL:image_url)," +
        "items:cart_items(id, quantity, subtotal, menuItem:menu_items(name, description, imageURL:image_url, price))")
        .match({"user_id": user!.id, pending: true})
        .maybeSingle()
        .then(({error, data}) => {
            return data as unknown as Cart
        })

    if (data == null) {
        return res.send({
            hasCart: false,
            cart: null
        })
    }

    res.send({
        hasCart: true,
        cart: data
    })

}

async function updateCart(req: NextApiRequest, res: NextApiResponse) {
    const body: UpdateCartDTO = req.body

    const client: SupabaseClient = createServerSupabaseClient({req, res})

    const {data: {user}} = await client.auth.getUser()

    let cart: Cart | null = await client.from("carts").select("id, subtotal, restaurantId:restaurant_id")
        .match({"user_id": user!.id, pending: true})
        .maybeSingle()
        .then(({data, error}) => {
            if (error) throw error
            return data as any
        })

    if (cart == null) return res.status(400).end()

    const {restaurantId, subtotal} = cart

    if (body.addItem != null) {
        const {menuItemId, quantity} = body.addItem
        const item: MenuItem = await client.from("menu_items").select("id, price")
            .match({id: menuItemId, restaurant_id: restaurantId})
            .single()
            .then(({data, error}) => {
                if (error) throw error
                return data as any
            })

        if (item == null) {
            return res.status(400).end()
        }

        let cartItem = await client.from("cart_items").insert({
            menu_item_id: menuItemId,
            cart_id: cart.id,
            item_price: item.price,
            quantity,
            user_id: user!.id
        })
            .select("id,subtotal")
            .single()
            .then(({error, data}) => {
                if (error) throw error
                return data
            })

        // Update the subtotal using the admin cliennt (users can't updated a cart, only cart items)
        await createAdminSupabaseClient().from("carts").update({
            subtotal: cart.subtotal + cartItem.subtotal
        }).eq("id", cart.id).then(({error}) => {
            if (error) throw error
        })

        res.status(200).end()
    } else if (body.removeItem != null) {
        let cartItem: CartItem = await client.from("cart_items").select("id, subtotal")
            .eq("id", body.removeItem.cartItemId)
            .single()
            .then(({error, data}) => {
                if (error) throw error
                return data as any
            })

        if (cartItem == null) {
            return res.status(400).end()
        }

        await client.from("cart_items")
            .delete()
            .eq("id", body.removeItem.cartItemId)
            .then(({error, data}) => {
                if (error) throw error
            })

        // Update the subtotal using the admin cliennt (users can't updated a cart, only cart items)
        await createAdminSupabaseClient().from("carts").update({
            subtotal: cart.subtotal - cartItem.subtotal
        }).eq("id", cart.id).then(({error}) => {
            if (error) throw error
        })

        res.status(204).end()
    } else {
        res.status(400).end()
    }
}

const handler: NextApiHandler = async (req, res) => {
    const supabaseClient = createServerSupabaseClient({req, res})

    const {data: {user}} = await supabaseClient.auth.getUser()

    if (user == null) {
        return res.status(403).end()
    }

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