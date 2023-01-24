import Navbar from "../components/Navbar";
import {PropsWithChildren, useCallback, useEffect} from "react";
import CartSlider from "../components/CartSlider";
import useSWR from 'swr'
import {AppDispatch, useAppDispatch} from "../state/store";
import {onCartUpdated, setCartLoading} from "../state/features/cart/cartReducer";
import {Cart} from "../data/Cart";

export default function DefaultLayout({children}: PropsWithChildren<any>) {
    return <>
        <div className="w-full h-full flex flex-col">
            <header>
                <Navbar/>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
        <CartSlider/>
    </>
}

export function withDefaultLayout(page: any) {
    return <DefaultLayout>
        {page}
    </DefaultLayout>
}