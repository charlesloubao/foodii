import Navbar from "../components/Navbar";
import {PropsWithChildren, useCallback, useEffect} from "react";
import CartSlider from "../components/CartSlider";
import useSWR from 'swr'
import {AppDispatch, useAppDispatch} from "../state/store";
import {onCartUpdated, setCartLoading} from "../state/features/cart/cartReducer";
import {Cart} from "../data/Cart";
import Sidebar, {SidebarProvider} from "../components/Sidebar";

export default function DefaultLayout({children}: PropsWithChildren<any>) {
    return <>
        <SidebarProvider>
            <div className="w-full h-full flex flex-col">
                <header>
                    <Navbar/>
                </header>
                <Sidebar/>
                <main className="flex-1">
                    {children}
                </main>
            </div>
            <CartSlider/>
        </SidebarProvider>
    </>
}

export function withDefaultLayout(page: any) {
    return <DefaultLayout>
        {page}
    </DefaultLayout>
}