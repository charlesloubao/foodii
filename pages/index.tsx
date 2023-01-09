import Head from 'next/head'
import {supabaseConfig} from "../supabaseConfig";
import {useEffect, useState} from "react";
import {Restaurant} from "../lib/Restaurant";
import {supabaseClient} from "../db";
import Link from "next/link";
import PopularRestaurantList from "../components/PopularRestaurantList";

export default function Home() {

    return (
        <>
            <Head>
                <title>Food Delivery</title>
            </Head>
            <main>
                <h1>Food Delivery</h1>
                <p>Find the best restaurants near you and order online!</p>
            </main>
            <div>
                <h2>Popular Restaurants</h2>
                <PopularRestaurantList/>
            </div>
        </>
    )
}
