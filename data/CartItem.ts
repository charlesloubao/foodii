import {MenuItem} from "./MenuItem";

export type CartItem = {
    id: string,
    quantity: number,
    item: MenuItem
    subtotal: number
}

export type CartItemDTO = {
    quantity: number,
    itemId: string,
}