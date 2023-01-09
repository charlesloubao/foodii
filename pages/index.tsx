import Head from 'next/head'
import {supabaseConfig} from "../supabaseConfig";

export default function Home() {
    console.log(supabaseConfig)
    return (
        <>
            <Head>
                <title>Food Delivery</title>
            </Head>
            <main>
                <h1>Food Delivery</h1>
                <p>Find the best restaurants near you and order online!</p>
            </main>
        </>
    )
}
