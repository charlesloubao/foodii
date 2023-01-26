import axios from "axios";
import {useRouter} from "next/router";
import {useEffect, useMemo, useRef} from "react";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {Order} from "../data/Order";
import update from "immutability-helper";
import {RealtimeChannel} from "@supabase/realtime-js";
import {NextPage} from "next";
import {useSWRConfig} from "swr";

export default function ConfirmPaymentCallback() {
    const router = useRouter()
    const user = useUser()
    const paymentIntent = useMemo<string>(() => router.query.payment_intent as string, [router])
    const supabaseClient = useSupabaseClient()
    const channel = useRef<RealtimeChannel>()
    const {mutate} = useSWRConfig()

    async function findOrderByPaymentIntent() {
        const orderId = await supabaseClient.from("orders")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntent)
            .maybeSingle()
            .then(response => response.data?.id)

        if (orderId != null) {
            await mutate("/api/cart")
            return router.replace("/track-order?id=" + orderId)
        }

        channel.current = supabaseClient.channel(`*`)
            .on("postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "orders",
                    filter: "stripe_payment_intent_id=eq." + paymentIntent
                },
                async (event) => {
                    await mutate("/api/cart")
                    router.push("/track-order?id=" + event.new.id)
                }).subscribe()
    }

    useEffect(() => {
        if (paymentIntent == null || user == null) return

        findOrderByPaymentIntent()
        return () => {
            channel.current && supabaseClient.removeChannel(channel.current)
        }

    }, [paymentIntent, user])

    if (paymentIntent == null) return <></>

    return <div className={"flex items-center justify-center text-xl font-bold w-full h-full"}>
        Please wait
    </div>
}

ConfirmPaymentCallback.getLayout = (page: NextPage) => page