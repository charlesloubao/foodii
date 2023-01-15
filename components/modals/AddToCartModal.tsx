import {closeModal} from "../../state/features/modal/modalReducer";
import {Minus, Plus, X} from "lucide-react";
import {useAppDispatch} from "../../state/store";
import {MenuItem} from "../../data/MenuItem";
import Styles from '../../styles/Modal.module.scss'
import ModalTopBar from "../ModalTopBar";
import Button from "../Button";
import {useMemo, useState} from "react";
import {addToCart} from "../../state/features/cart/cartReducer";
import {CartItem, CartItemDTO} from "../../data/CartItem";
import axios from "axios";
import {onError} from "../../state/features/error/errorReducer";

export default function AddToCartModal({item}: { item: MenuItem }) {
    const dispatch = useAppDispatch()
    const [quantity, setQuantity] = useState<number>(1)
    const finalPrice = useMemo<number>(() => item.price * quantity, [quantity, item.price])

    async function onAddClick() {
        try {
            const data: CartItemDTO = {
                itemId: item.id,
                quantity
            }
            const cartItem = await axios.put<CartItem>("/api/cart", data)
                .then(response => response.data)

            dispatch(addToCart(cartItem))
            dispatch(closeModal())
        }
        catch (e) {
            dispatch(onError(e as Error))
        }
    }

    return <div className={Styles.container}>
        <ModalTopBar/>
        <div className={Styles.content}>
            <h1 className="heading-2 mb-4">{item.name}</h1>
            <img src={item.imageURL} className="mb-4 w-full aspect-video object-cover rounded-md"/>
            <p>{item.description}</p>
        </div>
        <div className={`${Styles.bottomBar} flex items-center justify-between`}>
            <div className="flex items-center">
                <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}><Minus/></button>
                <div className={"mx-4"}>{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)}><Plus/></button>
            </div>
            <Button onClick={onAddClick}>Add to cart ${finalPrice.toFixed(2)}</Button>
        </div>
    </div>
}