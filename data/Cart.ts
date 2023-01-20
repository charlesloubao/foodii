import {CartItem, UpdateCartDTO} from "./CartItem";
import {Restaurant} from "./Restaurant";

export type Cart = {
    id: string,

    userId: string,
    items: CartItem[],
    restaurant: Restaurant,
    restaurantId?: string,
    subtotal: number
}

export type CartDTO = {
    restaurantId?: string,
}