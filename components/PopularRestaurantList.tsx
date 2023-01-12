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

            const data = await supabaseClient.from("restaurants").select("id, name, description, imageURL:image_url")
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

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {restaurants?.map(restaurant => <div key={restaurant.id}>
            <Link href={`/restaurants/${restaurant.id}`}>
                <div className="hover:bg-gray-100 p-4 rounded-md">
                    <div className="w-full aspect-video bg-gray-400 rounded-md mb-2 overflow-hidden object-fit">
                        <img src={restaurant.imageURL} className="w-full h-full" alt={""}/>
                    </div>
                    <h2 className="heading-2 mb-1">{restaurant.name}</h2>
                    <p>{restaurant.description}</p>

                </div>
            </Link>
        </div>)}
    </div>
}