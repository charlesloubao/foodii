import {PropsWithChildren, useEffect} from "react";
import useSWR from "swr";
import {useAppDispatch} from "../state/store";
import {onCartUpdated, setCartLoading} from "../state/features/cart/cartReducer";
import {GetCartResponse} from "../pages/api/cart";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";

export default function CartProvider({children}: PropsWithChildren) {
    //TODO: Make this realtime from database changes
    const user = useUser()
    const cart = useSWR<GetCartResponse>(() => user != null ? "/api/cart" : null)

    const supabase = useSupabaseClient()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (cart.data) {
            dispatch(setCartLoading(false))
            dispatch(onCartUpdated(cart.data!.cart))
        } else if (cart.isLoading) {
            dispatch(setCartLoading(true))
        }
    }, [cart])

    useEffect(() => {
        const {data: {subscription}} = supabase.auth.onAuthStateChange(() => {
            cart.mutate()
        })

        return () => {
            subscription.unsubscribe
        }
    }, [])


    return <>
        {children}
    </>
}