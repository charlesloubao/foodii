import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import createStripeClient from "../../../lib/createStripeClient";
import Stripe from 'stripe'
import {buffer} from 'micro';
import {createAdminSupabaseClient} from "../../../lib/supabaseUtils";
import {Cart} from "../../../data/Cart";

export const config = {
    api: {
        bodyParser: false
    }
}

async function onPaymentSucceeded(req: NextApiRequest, res: NextApiResponse<any>, data: Stripe.PaymentIntent) {
    const {cartId} = data.metadata
    const supabaseClient = createAdminSupabaseClient()

    const cart: Cart | null = await supabaseClient.from("carts").select(`
            id,
            subtotal,
            userId:user_id,
            restaurantId:restaurant_id,
            items:cart_items(
                id,
                subtotal
            )
    `).eq("id", cartId)
        .maybeSingle()
        .then(({data, error}) => {
            return data as unknown as Cart
        })

    if (cart == null) return

    const fees = 0
    const taxes = 0

    await supabaseClient.from("orders").insert({
        cart_id: cartId,
        user_id: cart.userId,
        restaurant_id: cart.restaurantId,
        fees,
        taxes,
        subtotal: cart.subtotal,
        status: "received"
    })
        .select()
        .maybeSingle()
        .then(({error, data: orderData}) => {
            if (error) throw error
            return orderData
        })

    await supabaseClient.from("carts")
        .update({pending: false})
        .eq("id", cartId)

    res.status(204).end()
}

const handler: NextApiHandler = async (req, res) => {
    const signature = req.headers["stripe-signature"]!
    const stripeClient = createStripeClient()

    let event: Stripe.Event

    try {
        const buf = await buffer(req)
        event = stripeClient.webhooks.constructEvent(buf, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (e) {
        console.error(new Error("Webhook error", {cause: e}))
        res.status(400).end()
        return
    }


    switch (event.type) {
        case "payment_intent.succeeded":
            return onPaymentSucceeded(req, res, event.data.object as Stripe.PaymentIntent)
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(204).end()
}

export default handler