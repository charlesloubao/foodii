import {useSelector} from "react-redux";
import {useAppSelector} from "../state/store";
import {ReactNode} from "react";

export default function OrderSummaryText() {
    const cart = useAppSelector(state => state.cart)
    return <div>
        <SummaryEntry label={"Subtotal"} value={<span>${cart.total}</span>}/>
        <SummaryEntry label={"Delivery fee"} value={<span>$0</span>}/>
        <SummaryEntry label={"Tax"} value={<span>${0}</span>}/>
        <div className="mt-4">
            <SummaryEntry label={<span className="text-lg font-bold">Total</span>}
                          value={<span className="text-lg font-bold">${cart.total}</span>}/>
        </div>
    </div>
}

function SummaryEntry({value, label}: { label: ReactNode, value: ReactNode }) {
    return <div className="flex items-center mb-2">
        <div className="flex-1 font-semibold">{label}</div>
        <div>{value}</div>
    </div>
}