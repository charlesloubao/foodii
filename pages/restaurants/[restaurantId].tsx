import {GetStaticPaths, GetStaticProps} from "next";
import {restaurants, supabaseClient} from "../../db";
import {Restaurant} from "../../lib/Restaurant";
import {useRouter} from "next/router";

type RestaurantPageProps = {
    restaurant?: Restaurant
}

export const getStaticProps: GetStaticProps<RestaurantPageProps> = async (context) => {
    const restaurantId: string = context.params!.restaurantId as string
    const restaurant: Restaurant | null = await supabaseClient.from("restaurants")
        .select('id, name, description, imageURL:image_url,' +
            'menu:menu_categories(id, name, description,' +
            'items:menu_items(id, name, description, imageURL:image_url, price))')

        .eq("id", restaurantId)
        .single()
        .then(result => {
            if (result.error) {
                console.error(result.error)
            }
            const restaurant = (result.data as unknown) as Restaurant
            return restaurant
        })

    if (restaurant == null) {
        return {
            notFound: true,
            revalidate: 1
        }
    }

    return {
        props: {
            restaurant,
        }
    }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
    const restaurantIds: string[] = await supabaseClient.from("restaurants")
        .select("id")
        .then(response => response.data?.map(({id}: any) => id) ?? [])

    return {
        paths: restaurantIds.map(id => `/restaurants/${id}`),
        fallback: "blocking"
    }
}

export default function RestaurantPage({restaurant}: RestaurantPageProps) {
    const router = useRouter()

    if (router.isFallback) {
        return <div>Loading please wait</div>
    } else if (restaurant == null) {
        return <></>
    }

    return <>
        <img src={restaurant.imageURL} width={100} height={100} alt={""}/>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <h2>Menu</h2>
        {
            restaurant.menu.map(category => <div key={category.id}>
                <h3>{category.name}</h3>
                <p>{category.description}</p>

                <div>
                    {category.items.map(item => <div key={item.id}>
                        <div>
                            {item.imageURL != null && <img src={item.imageURL} alt="" width={100} height={100}/>}
                        </div>
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <strong>${item.price}</strong>
                    </div>)}
                </div>
            </div>)
        }
    </>
}