import {useEffect, useState} from "react";
import {Restaurant} from "../lib/Restaurant";
import {supabaseClient} from "../db";
import Link from "next/link";

export default function PopularRestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<String | null>()

    async function fetchRestaurants() {
        try {
            setLoading(true)

            const data = await supabaseClient.from("restaurants").select()
                .order("created_at", {ascending: false})
                .then(response => response.data as Restaurant[] ?? [])

            setRestaurants(data)
        } catch (e) {
            console.error(e)
            setError("Failed to load restaurants")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurants()
    }, [])

    if (loading) {
        return <>Loading...</>
    } else if (error) {
        return <>{error}</>
    }

    return <div>
        {restaurants?.map(restaurant => <div key={restaurant.id}>
            <Link href={`/restaurants/${restaurant.id}`}>
                <h3>{restaurant.name}</h3>
            </Link>
            <p>{restaurant.description}</p>
        </div>)}
    </div>
}