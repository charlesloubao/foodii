import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {Order} from "../data/Order";

export default function TrackOrder() {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()

    const orderId = useMemo<string>(() => router.query.orderId as string, [router.query])

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>()
    const [order, setOrder] = useState<Order | null>()

    async function fetchOrder() {
        try {
            setLoading(true)
            const result = await supabaseClient.from("orders").select("id, status," +
                "subtotal, taxes, fees, total," +
                "restaurant:restaurants(id, name)," +
                "cart:carts(id, items:cart_items(id, quantity, subtotal))")
                .eq('id', orderId)
                .single()
                .then(({error, data}) => {
                    if (error) throw error
                    return data as unknown as Order
                })
            setOrder(result)
        } catch (e) {
            setError("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (orderId == null) return
        fetchOrder()

        const channel = supabaseClient.channel(`*`)
            .on("postgres_changes",
                {event: "UPDATE", schema: "public", table: "orders", filter: "id=eq." + orderId},
                (event) => {
                    //TODO: transform data
                    setOrder(event.new as Order)
                }).subscribe()

        return () => {
            supabaseClient.removeChannel(channel)
        }
    }, [orderId])

    if (orderId == null) {
        return <></>
    }

    if (loading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>An error occurred</div>
    } else if (order == null) {
        return <></>
    }

    return <div className="text-center">
        <div className="md:w-2/3 lg:w-1/2 mx-auto p-4">
            <div> Order ID: {order.id}
            </div>
            <div>
                Status: {order.status}
            </div>
        </div>
    </div>
}

TrackOrder.getLayout = (page: NextPage) => page