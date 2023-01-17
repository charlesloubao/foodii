import {Restaurant} from "./Restaurant";
import {Cart} from "./Cart";

export type OrderStatus =
    "received"
    | "confirmed"
    | "enroute_to_pickup"
    | "picked_up"
    | "enroute_to_dropoff"
    | "delivered"

export type Order = {
    id: string,
    restaurant: Restaurant,
    cart: Cart,
    status: OrderStatus
}