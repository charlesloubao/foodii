import useSWR from "swr";
import {Order} from "../data/Order";
import {useUser} from "@supabase/auth-helpers-react";
import {GetServerSideProps} from "next";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {getRedirectURL} from "../lib/redirectUtils";
import SWRResult from "../components/SWRResult";
import React from "react";
import OrderListItem from "../components/OrderListItem";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabaseClient = createServerSupabaseClient(context)
    const {data: {user}} = await supabaseClient.auth.getUser()

    if (user == null) {
        return {
            redirect: {
                destination: `/sign-in?redirectTo=${getRedirectURL("/orders")}`,
                permanent: false,
            },
            props: {}
        }
    }

    return {
        props: {}
    }

}
export default function Orders() {
    const user = useUser()
    const orders = useSWR<Order[]>(user ? "/api/orders" : null)
    return <div className={"app-container"}>
        <h1 className="heading-1 mb-4">Orders</h1>
        <SWRResult response={orders}
                   renderError={() => <div>Failed to load orders</div>}
                   renderData={(data) => <div className="flex flex-col gap-4">
                       {data.map(order => <OrderListItem order={order} key={order.id}/>)}
                   </div>}
                   renderLoading={() => <div>Loading orders...</div>}/>
    </div>
}