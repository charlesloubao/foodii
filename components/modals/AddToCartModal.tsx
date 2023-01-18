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
import useSWR from "swr";
import {useUser} from "@supabase/auth-helpers-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {getRedirectURL} from "../../lib/redirectUtils";

export default function AddToCartModal({item}: { item: MenuItem }) {
    const cartSWR = useSWR("/api/cart")

    const router = useRouter()
    const user = useUser()

    const cart = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()
    const [quantity, setQuantity] = useState<number>(1)
    const finalPrice = useMemo<number>(() => item.price * quantity, [quantity, item.price])

    async function onAddClick() {
        let cartData: Cart | null = cart.data

        try {
            if (cartData == null) {
                let newCart: CartDTO = {
                    restaurantId: cart.currentRestaurant!.id
                }
                await axios.post<Cart>("/api/cart", newCart)
                    .then(response => response.data)
            }

            const data: UpdateCartDTO = {
                addItem: {
                    menuItemId: item.id,
                    quantity
                }
            }

            await axios.put("/api/cart", data).then(response => response.data)
            cartSWR.mutate()

            dispatch(closeModal())
        } catch (e) {
            dispatch(onError(e as Error))
        }
    }

    if (user == null) {
        return <div className={Styles.container}>
            <ModalTopBar/>
            <div className={Styles.content}>
                <Link
                    href={`/sign-in?redirectTo=${encodeURIComponent(getRedirectURL(`${router.asPath}?addToCart=${item.id}`))}`}>
                    <p className="mb-4">Sign in to add things to your cart</p>
                    <Button onClick={() => dispatch(closeModal())}>Click here to sign in</Button>
                </Link>
            </div>
        </div>
    }

    return <div className={Styles.container}>
        <ModalTopBar/>
        <div className={Styles.content}>
            {cart.cartLoading ? <>Loading cart</>
                : <>            <h1 className="heading-2 mb-4">{item.name}</h1>
                    <img src={item.imageURL} className="mb-4 w-full aspect-video object-cover rounded-md"/>
                    <p>{item.description}</p></>}
        </div>
        {!cart.cartLoading && <div className={`${Styles.bottomBar} flex items-center justify-between`}>
            <div className="flex items-center">
                <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}><Minus/></button>
                <div className={"mx-4"}>{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)}><Plus/></button>
            </div>
            <Button onClick={onAddClick}>Add to cart ${finalPrice.toFixed(2)}</Button>
        </div>}
    </div>
}