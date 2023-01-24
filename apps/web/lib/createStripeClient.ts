import Stripe from "stripe";

export default function createStripeClient() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15"
    })
}