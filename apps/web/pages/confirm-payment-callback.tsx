import axios from "axios";
import {useRouter} from "next/router";
import {useEffect, useMemo, useRef} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {Order} from "../data/Order";
import update from "immutability-helper";
import {RealtimeChannel} from "@supabase/realtime-js";
import {NextPage} from "next";

export default function ConfirmPaymentCallback() {
    const router = useRouter()
    const paymentIntent = useMemo<string>(() => router.query.payment_intent as string, [router])
    const supabaseClient = useSupabaseClient()
    const channel = useRef<RealtimeChannel>()

    async function findOrderByPaymentIntent() {
        const orderId = await supabaseClient.from("orders")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntent)
            .maybeSingle()
            .then(response => response.data?.id)

        if (orderId != null) return router.replace("/track-order?id=" + orderId)

        channel.current = supabaseClient.channel(`*`)
            .on("postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "orders",
                    filter: "stripe_payment_intent_id=eq." + paymentIntent
                },
                (event) => {
                    router.push("/track-order?id=" + event.new.id)
                }).subscribe()
    }

    useEffect(() => {
        if (paymentIntent == null) return

        findOrderByPaymentIntent()
        return () => {
            channel.current && supabaseClient.removeChannel(channel.current)
        }

    }, [paymentIntent])

    if (paymentIntent == null) return <></>

    return <></>
}

ConfirmPaymentCallback.getLayout = (page: NextPage) => page