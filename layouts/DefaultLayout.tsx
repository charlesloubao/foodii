import Navbar from "../components/Navbar";
import {PropsWithChildren} from "react";
import {useAppDispatch, useAppSelector} from "../state/store";
import Button from "../components/Button";
import {X} from "lucide-react";
import {removeFromCart, toggleCart} from "../state/features/cart/cartReducer";
import CartSlider from "../components/CartSlider";

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