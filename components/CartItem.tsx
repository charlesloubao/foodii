import {removeFromCart} from "../state/features/cart/cartReducer";
import {X} from "lucide-react";
import {MenuItem} from "../lib/MenuItem";
import {useAppDispatch} from "../state/store";

export default function CartItem({item, index}: { item: MenuItem, index: number }) {
    const dispatch = useAppDispatch()

    return <div
        className={"flex items-start gap-4 mb-4"}>
        <div className="relative">
            <div className="w-[50px] h-[50px] rounded-md overflow-hidden">
                {item.imageURL && <img src={item.imageURL} className="w-full h-full" alt=""/>}
            </div>
            <button
                className="absolute bg-black text-white text-[10px] w-8 h-8 flex items-center justify-center p-2 rounded-full  -left-[10px] -bottom-[10px]">{1} x
            </button>
        </div>

        <div className="flex-1">
            <div className="font-semibold">
                {item.name}
            </div>
            <p className="line-clamp-2 mb-1">
                {item.description}
            </p>
            <div>
                ${item.price}
            </div>

        </div>
        <div>
            <button className="inline-block bg-gray-200 w-[32px] h-[32px] rounded-full flex items-center justify-center"
                    onClick={() => dispatch(removeFromCart(index))}><X width={18}/></button>
        </div>
    </div>
}