import axios from "axios";
import {useRouter} from "next/router";
import {useEffect, useMemo, useRef} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {Order} from "../data/Order";

export default function ConfirmPaymentCallback() {
    const router = useRouter()
    const paymentIntent = useMemo<string>(() => router.query.payment_intent as string, [router])
    const supabaseClient = useSupabaseClient()
    const unsubscribe: any = useRef()

    async function waitForOrder() {
        //TODO: query stripe for cartId
        //TODO: query orders with cartId
        //TODO: if order is null subscribe to db channel for order insert and redirect to /track-order?id={orderID}
        //TODO: else redirect to /track-order?id={orderID}
    }

    useEffect(() => {
        if (paymentIntent == null) return

        waitForOrder()
        return () => {
            unsubscribe.current && unsubscribe.current()
        }

    }, [paymentIntent])

    if (paymentIntent == null) return <></>

    return <div>
        {paymentIntent}
    </div>
}