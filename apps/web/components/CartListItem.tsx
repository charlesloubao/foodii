import {X} from "lucide-react";
import {useAppDispatch} from "../state/store";
import {CartItem, UpdateCartDTO} from "../data/CartItem";
import {onError} from "../state/features/error/errorReducer";
import axios from "axios";
import useSWR from "swr";


export default function CartListItem({item, removable, index}: { removable?: boolean, item: CartItem, index: number }) {
    const cartSWR = useSWR("/api/cart")
    const dispatch = useAppDispatch()

    async function removeFromCart() {
        try {
            const data: UpdateCartDTO = {
                removeItem: {
                    cartItemId: item.id
                }
            }
            await axios.put("/api/cart", data)
            cartSWR.mutate()
        } catch (e: any) {
            dispatch(onError(e))
        }
    }

    return <div
        className={"flex items-start gap-4 mb-4"}>
        <div className="relative">
            <div className="w-[50px] h-[50px] rounded-md overflow-hidden">
                {item.menuItem.imageURL && <img src={item.menuItem.imageURL} className="w-full h-full" alt=""/>}
            </div>
            <button
                className="absolute bg-black text-white text-[10px] w-8 h-8 flex items-center justify-center p-2 rounded-full  -left-[10px] -bottom-[10px]">{item.quantity} x
            </button>
        </div>

        <div className="flex-1">
            <div className="font-semibold">
                {item.menuItem.name}
            </div>
            <p className="line-clamp-2 mb-1">
                {item.menuItem.description}
            </p>
            <div>
                ${item.subtotal}
            </div>

        </div>
        {removable && <div>
            <button className="inline-block bg-gray-200 w-[32px] h-[32px] rounded-full flex items-center justify-center"
                    onClick={removeFromCart}><X width={18}/></button>
        </div>}
    </div>
}