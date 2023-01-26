import PopularRestaurantList from "../components/PopularRestaurantList";
import DefaultLayout from "../layouts/DefaultLayout";
import Head from 'next/head'
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useEffect} from "react";

export default function Home() {
    return (
        <>
            <Head>
                <title>Food Delivery</title>
            </Head>
            <div className="app-container">
                <h1 className="heading-1 mb-4">Top restaurants in New York</h1>
                <PopularRestaurantList/>

            </div>
        </>
    )
}
