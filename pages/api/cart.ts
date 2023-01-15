import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {NextApiHandler} from "next";
import {MenuItem} from "../../data/MenuItem";
import {CartItem, CartItemDTO} from "../../data/CartItem";

const handler: NextApiHandler<CartItem> = async (req, res) => {
    if (req.method !== "PUT") return res.status(405).end()

    const body: CartItemDTO = req.body

    const supabaseClient = createServerSupabaseClient({req, res})

    const item: MenuItem | null = await supabaseClient.from("menu_items").select(
        "id, name, description, imageURL:image_url, price"
    ).eq("id", body.itemId)
        .single()
        .then(response => response.data as MenuItem)

    if (item == null) {
        return res.status(400).end()
    }

    const response: CartItem = {
        id: Date.now().toString(),
        item,
        quantity: body.quantity,
        subtotal: item.price * body.quantity
    }

    res.send(response)
}

export default handler