import {CartItem, UpdateCartDTO} from "./CartItem";
import {Restaurant} from "./Restaurant";

export type Cart = {
    id: number,
    items: CartItem[],
    restaurant: Restaurant,
    subtotal: number
}

export type CartDTO = {
    restaurantId?: string,
}