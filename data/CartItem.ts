import {MenuItem} from "./MenuItem";

export type CartItem = {
    id: string,
    quantity: number,
    menuItem: MenuItem
    subtotal: number
}

export type UpdateCartDTO = {
    addItem?: {
        quantity: number,
        menuItemId: string,
    },
    removeItem?: {
        cartItemId: string,
    }

}