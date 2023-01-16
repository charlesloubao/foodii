import {CartItem, UpdateCartDTO} from "./CartItem";
import {Restaurant} from "./Restaurant";

export type Cart = {
    id: number,
    items: CartItem[],
    restaurant: Restaurant,
    total: number
}

export type CartDTO = {
    restaurantId?: string,
}