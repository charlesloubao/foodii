import {PropsWithChildren, useEffect} from "react";
import useSWR from "swr";
import {Cart} from "../data/Cart";
import {useAppDispatch} from "../state/store";
import {onCartUpdated, setCartLoading} from "../state/features/cart/cartReducer";

export default function CartProvider({children}: PropsWithChildren) {
    const cart = useSWR<Cart>("/api/cart")
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setCartLoading(cart.isLoading))
        if (cart.data) {
            dispatch(onCartUpdated(cart.data))
        }
    }, [cart])


    return <>
        {children}
    </>
}