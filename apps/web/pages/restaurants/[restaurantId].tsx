import {GetStaticPaths, GetStaticProps} from "next";
import {restaurants, supabaseClient} from "../../db";
import {Restaurant} from "../../data/Restaurant";
import {useRouter} from "next/router";
import MenuItemCard from "../../components/MenuItemCard";
import {useEffect, useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {setCurrentRestaurant} from "../../state/features/cart/cartReducer";
import {openModal} from "../../state/features/modal/modalReducer";
import {useUser} from "@supabase/auth-helpers-react";

type RestaurantPageProps = {
    restaurant: Restaurant | null
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
    const dispatch = useAppDispatch()
    const user = useUser()

    const {data: cartData, currentRestaurant, cartLoading} = useAppSelector(state => state.cart)
    const {addToCart} = useMemo<any>(() => router.query as any, [router.query])

    useEffect(() => {
        dispatch(setCurrentRestaurant(restaurant))
    }, [restaurant])

    useEffect(() => {
        if (cartLoading) return;
        if (user !== null && restaurant != null && addToCart != null) {
            const item = (restaurant.menu.find(category => category.items.find(item => item.id !== addToCart)))?.items.find(item => item.id == addToCart)

            if (cartData != null && cartData.restaurantId !== currentRestaurant!.id) {
                dispatch(openModal({
                    type: "ordering-from-other-restaurant-warning",
                    data: item!
                }))
                return
            }

            dispatch(openModal({
                type: "add-to-cart",
                data: item!
            }))

            router.replace(`/restaurants/${restaurant.id}`, undefined, {shallow: true})
        }
    }, [user, cartData, addToCart, cartLoading])

    if (router.isFallback) {
        return <div>Loading please wait</div>
    } else if (restaurant == null) {
        return <></>
    }

    return <div className="app-container">
        <img src={restaurant.imageURL} className="mb-4 w-[100px] h-[100px] rounded-full object-cover" alt={""}/>
        <div className="mb-6">
            <h1 className="heading-1 mb-2">{restaurant.name}</h1>
            <p>{restaurant.description}</p>
        </div>
        <div>
            <h2 className="heading-2 mb-4">Menu</h2>
            {
                restaurant.menu.map(category => <div key={category.id}>
                    <h3 className="heading-3 mb-1">{category.name}</h3>
                    <p className="mb-4">{category.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map(item => <MenuItemCard key={item.id} item={item}/>)}
                    </div>
                </div>)
            }
        </div>
    </div>
}