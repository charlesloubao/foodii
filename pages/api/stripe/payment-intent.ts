import {NextApiHandler} from "next";
import {withUserSignedIn} from "../../../middleware/withUserSignedIn";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {Cart} from "../../../data/Cart";
import createStripeClient from "../../../lib/createStripeClient";

const handler: NextApiHandler = async (req, res) => {
    const stripeClient = createStripeClient()

    if (req.method !== "POST") return res.status(405).end()

    const supabaseClient = createServerSupabaseClient({req, res})
    const {data: {user}} = await supabaseClient.auth.getUser()

    const cart: Cart = await supabaseClient.from("carts")
        .select("id, subtotal")
        .match({user_id: user!.id, pending: true})
        .maybeSingle()
        .then(({data, error}) => {
            if (error) throw  error
            return data as unknown as Cart
        })

    if (cart == null) return res.status(400).end()

    const fees = 0
    const taxes = 0
    const total = cart.subtotal + fees + taxes

    const paymentIntent = await stripeClient.paymentIntents.create({
        amount: total * 100, // Stripe works in cents
        currency: "usd",
        automatic_payment_methods: {enabled: true}
    })

    res.send({
        clientSecret: paymentIntent.client_secret
    })
}

export default withUserSignedIn(handler)