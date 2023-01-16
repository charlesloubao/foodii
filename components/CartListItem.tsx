import {X} from "lucide-react";
import {useAppDispatch} from "../state/store";
import {CartItem} from "../data/CartItem";



export default function CartListItem({item, removable, index}: { removable?: boolean, item: CartItem, index: number }) {
    const dispatch = useAppDispatch()

    function removeFromCart() {

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