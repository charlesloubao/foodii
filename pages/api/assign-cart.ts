import {NextApiHandler} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {clearCookie} from "../../lib/cookieUtils";

const handler: NextApiHandler = async (req, res) => {
    const supabase = createServerSupabaseClient({req, res})

    const cartId = req.cookies.cartId
    const {data: {user}} = await supabase.auth.getUser()

    if (user == null || cartId == null) {
        res.setHeader("Set-Cookie", clearCookie("cartId"))
        return res.redirect("/")
    }

    const cart = await supabase.from("carts")
        .select()
        .match({
            id: cartId,
            temporary: true
        })
        .single()
        .then(({data, error}) => {
            return data
        })

    if (cart != null) {
        await supabase.from("carts")
            .update({user_id: user.id})
            .eq("id", cartId)

        return res.redirect("/checkout")
    } else {
        res.setHeader("Set-Cookie", clearCookie("cartId"))
        return res.redirect("/")
    }
}

export default handler