import {Restaurant} from "./Restaurant";
import {Cart} from "./Cart";

export type OrderStatus =
    "received"
    | "out_for_delivery"
    | "delivered"

export type Order = {
    customerName: string
    instructions: string
    address: string
    phoneNumber: string
    id: string,
    createdAt: string,
    deliveredAt: string | null,
    restaurant: Restaurant,
    cart: Cart,
    status: OrderStatus,
    total: number,
    itemsCount: number
    inProgress: boolean
}