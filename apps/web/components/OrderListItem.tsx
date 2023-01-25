import {Order, OrderStatus} from "../data/Order";
import Link from "next/link";
import moment from "moment";
import Button from "./Button";
import {Check, CheckCircle2, Circle, CircleDot} from "lucide-react";

const statusValue = {
    "received": "Received",
    "out_for_delivery": "Out for delivery",
    "delivered": "Delivered",
}
export default function OrderListItem({order}: { order: Order }) {
    return <div className={"p-4 border rounded-md "}>
        <h2 className={"font-bold mb-2"}>{order.restaurant.name}</h2>

        {order.inProgress
            ? <div className={"font-semibold text-green-700 flex items-center gap-2"}>
                <span className={"w-3 h-3 relative"}>
                    <span className={"absolute top-0 left-0 w-3 h-3 rounded-full bg-green-700"}></span>
                <span className={"absolute top-0 left-0 animate-ping w-3 h-3 rounded-full bg-green-700"}></span>
                </span>
                {statusValue[order.status]}</div>
            : <div className={"font-semibold text-green-700 flex items-center gap-1"}><CheckCircle2 size={18}/>Delivered
            </div>}
        <div className={"mb-2 font-semibold"}>
            {moment(order.createdAt).format("ddd, MMM DD")} •
            ${order.total} • {order.itemsCount} item{order.itemsCount > 1 ? 's' : ''}
        </div>
        <Link href={`/track-order?id=${order.id}`}>
            <Button>View order</Button>
        </Link>
    </div>

}