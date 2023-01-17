import {X} from "lucide-react";
import {toggleCart} from "../state/features/cart/cartReducer";
import {useAppDispatch, useAppSelector} from "../state/store";
import CartListItem from "./CartListItem";
import Button from "./Button";
import React, {ReactNode} from "react";
import {useRouter} from "next/router";
import OrderSummaryText from "./OrderSummaryText";

export default function CartSlider() {
    const router = useRouter()

    const cart = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()

    function onToggleCartClick() {
        dispatch(toggleCart())
    }

    function onCheckoutClick() {
        dispatch(toggleCart())
        router.push("/checkout")
    }

    return <>
        {cart.showCart && <div className="z-20 w-full h-full fixed top-0 left-0 bg-black bg-opacity-50">
            <div className="flex flex-col bg-white w-full md:w-1/3 lg:w-1/4 h-full absolute top-0 right-0">

                {cart.data != null
                    ? <>
                        <div className={"flex items-center gap-2 border-b p-4"}>
                            <button onClick={onToggleCartClick}><X/></button>
                            <h1 className="text-xl font-bold">Cart {cart.data.items.length > 0 &&
                                <span>({cart.data.items.length})</span>}</h1>
                        </div>
                        <div className="flex-1 pl-8 p-4 overflow-y-auto overflow-x-hidden border-b">
                            {cart.data.items.map((item, index) => (
                                <CartListItem removable={true} key={`cart_item_${index}`} item={item} index={index}/>))}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Summary</h2>
                            {/* eslint-disable-next-line react/jsx-no-undef */}
                            <OrderSummaryText cart={cart.data}/>
                            <Button onClick={onCheckoutClick} className="flex items-center justify-between w-full ">
                                <span>Checkout</span>
                                <span>${cart.data.subtotal}</span>
                            </Button>
                        </div>
                    </>
                    : <></>}

            </div>
        </div>}
    </>
}

