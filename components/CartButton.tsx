import {ShoppingCart} from "lucide-react";
import {useAppDispatch, useAppSelector} from "../state/store";
import {toggleCart} from "../state/features/cart/cartReducer";

export default function CartButton() {
    const {items} = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()

    return <button onClick={() => dispatch(toggleCart())}
                   className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full">
        <ShoppingCart/>
        <div className="font-bold">{items.length}</div>
    </button>
}