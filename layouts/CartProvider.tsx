import {PropsWithChildren, useEffect} from "react";
import useSWR from "swr";
import {Cart} from "../data/Cart";
import {useAppDispatch} from "../state/store";
import {onCartUpdated, setCartLoading} from "../state/features/cart/cartReducer";
import {GetCartResponse} from "../pages/api/cart";

export default function CartProvider({children}: PropsWithChildren) {
    const cart = useSWR<GetCartResponse>("/api/cart")
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (cart.data) {
            dispatch(setCartLoading(false))
            dispatch(onCartUpdated(cart.data!.cart))
        }
        else if(cart.isLoading) {
            dispatch(setCartLoading(true))

        }
    }, [cart])


    return <>
        {children}
    </>
}