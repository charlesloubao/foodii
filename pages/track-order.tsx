import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useMemo, useState} from "react";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {Order, OrderStatus} from "../data/Order";
import {ArrowLeft, CheckCircle, CheckCircle2} from "lucide-react";
import moment from "moment";
import OrderSummaryText from "../components/OrderSummaryText";
import CartListItem from "../components/CartListItem";
import update from "immutability-helper";
import AppLogo from "../components/AppLogo";

function OrderTimelineItem({completed, label}: { completed: boolean, label: string }) {
    return <div className="flex items-center flex-col gap-2">
        <CheckCircle2 className={completed ? "text-green-500" : "text-gray-400"} width={24}/>
        <div className={completed ? "text-black font-bold" : "text-gray-400"}>{label}</div>
    </div>
}

function OrderTimeline({status}: { status: OrderStatus }) {
    const [progressBar1Value, setProgressBar1Value] = useState<number>(0)
    const [progressBar2Value, setProgressBar2Value] = useState<number>(0)

    useEffect(() => {
        switch (status) {
            case "received":
                setProgressBar1Value(0.7)
                setProgressBar2Value(0)
                break
            case "out_for_delivery":
                setProgressBar1Value(1)
                setProgressBar2Value(0.7)
                break
            case "delivered":
                setProgressBar1Value(1)
                setProgressBar2Value(1)
                break
        }
    }, [status])

    return <div className="flex items-start justify-between gap-4">
        <OrderTimelineItem completed={true} label="Received"/>
        <OrderTimelineProgressBar progress={progressBar1Value}/>
        <OrderTimelineItem completed={status == "out_for_delivery" || status == "delivered"} label="Out for delivery"/>
        <OrderTimelineProgressBar progress={progressBar2Value}/>
        <OrderTimelineItem completed={status === "delivered"} label="Delivered"/>
    </div>
}

function OrderTimelineProgressBar({progress}: { progress: number }) {
    return <div className="mt-2 h-1 w-full relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300"/>
        <div style={{width: progress * 100 + "%"}}
             className="absolute top-0 left-0 transition-all h-full bg-green-500"/>
    </div>
}

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
                "subtotal, taxes, fees, total, createdAt:created_at," +
                "restaurant:restaurants(id, name)," +
                "cart:carts(id, subtotal, items:cart_items(id, quantity, subtotal, menuItem:menu_items(name, description, price, imageURL:image_url)))")
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
                    setOrder(old => update(old, {
                        status: {$set: event.new.status}
                    }))
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

    return <div className="flex flex-col w-full h-full">
        <div className="p-4 flex items-center justify-between border-b">
            <button className="flex items-center gap-4 font-bold" onClick={() => router.push("/")}>
                <ArrowLeft/>
                Return home
            </button>
            <AppLogo/>
            <div className="hidden lg:block"></div>
        </div>
        <div className="flex-1 overflow-auto md:w-2/3 lg:w-1/2 mx-auto p-4">
            <h1 className="heading-1 mb-4">{order.restaurant?.name}</h1>
            <div className="mb-12 font-semibold">{moment(order.createdAt).format('MMMM DD, YYYY, h:mm A')}</div>
            <OrderTimeline status={order.status}/>
            <div className="mt-8">
                <h2 className="heading-2 mb-4 ">Order details</h2>
                <div>

                    {order.cart.items.map((item, index) => (
                        <CartListItem removable={false} key={item.id} item={item} index={index}/>))}

                </div>
                <OrderSummaryText cart={order.cart}/>

            </div>
        </div>
    </div>
}

TrackOrder.getLayout = (page: NextPage) => page