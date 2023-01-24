import {PropsWithChildren, useEffect} from "react";
import useSWR from "swr";
import {useAppDispatch} from "../state/store";
import {onCartUpdated, setCartLoading} from "../state/features/cart/cartReducer";
import {GetCartResponse} from "../pages/api/cart";
import {useUser} from "@supabase/auth-helpers-react";

export default function CartProvider({children}: PropsWithChildren) {
    const user = useUser()
    const cart = useSWR<GetCartResponse>(() => user != null ? "/api/cart" : null)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (cart.data) {
            dispatch(setCartLoading(false))
            dispatch(onCartUpdated(cart.data!.cart))
        } else if (cart.isLoading) {
            dispatch(setCartLoading(true))
        }
    }, [cart])


    return <>
        {children}
    </>
}