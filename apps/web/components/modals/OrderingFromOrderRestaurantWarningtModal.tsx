import {closeModal, openModal} from "../../state/features/modal/modalReducer";
import {Minus, Plus, X} from "lucide-react";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {MenuItem} from "../../data/MenuItem";
import Styles from '../../styles/Modal.module.scss'
import ModalTopBar from "../ModalTopBar";
import Button from "../Button";
import {useEffect, useMemo, useState} from "react";
import {CartItem, UpdateCartDTO} from "../../data/CartItem";
import axios from "axios";
import {onError} from "../../state/features/error/errorReducer";
import {Cart, CartDTO} from "../../data/Cart";
import {onCartUpdated} from "../../state/features/cart/cartReducer";
import useSWR, {useSWRConfig} from "swr";
import {useUser} from "@supabase/auth-helpers-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {getRedirectURL} from "../../lib/redirectUtils";

export default function OrderingFromOrderRestaurantWarningModal({item}: { item: MenuItem }) {
    const {mutate} = useSWRConfig()

    const dispatch = useAppDispatch()
    const {currentRestaurant, data} = useAppSelector(state => state.cart)

    const [clearingCart, setClearingCart] = useState<boolean>(false)

    async function clearCart() {
        try {
            setClearingCart(true)
            await axios.delete("/api/cart")
            await mutate("/api/cart")
            dispatch(openModal({
                type: "add-to-cart",
                data: item
            }))
        } catch (e) {
            dispatch(onError(e))
        } finally {
            setClearingCart(false)
        }
    }

    return <div className={Styles.container}>
        <ModalTopBar closeButton={!clearingCart} title={"Start a new order?"}/>
        <div className={Styles.content}>
            You currently have an item from another menu in your cart. Would you like to clear your existing cart
            and start a new one?
        </div>
        <div className={`${Styles.bottomBar} space-x-2`}>
            <Button disabled={clearingCart}
                    onClick={clearCart}>{clearingCart ? 'Clearing cart...' : 'Yes, clear cart'}</Button>
            <Button disabled={clearingCart} onClick={() => !clearingCart && dispatch(closeModal())}
                    variant={"secondary"}>Cancel</Button>
        </div>
    </div>
}