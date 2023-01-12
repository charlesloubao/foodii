import {MenuItem} from "../../../lib/MenuItem";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import update from 'immutability-helper';

export type CartState = {
    items: MenuItem[],
    total: number,
    showCart: boolean
}

const initialState: CartState = {
    items: [],
    total: 0,
    showCart: false
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        toggleCart(state: CartState) {
            state.showCart = !state.showCart
        },
        addToCart(state: CartState, action: PayloadAction<MenuItem>) {
            const items = update(state.items, {
                $push: [action.payload]
            })
            state.items = items
            state.total = items.reduce((previousValue, item) => previousValue + item.price, 0)
        },

        removeFromCart(state: CartState, action: PayloadAction<number>) {
            const items = update(state.items, {
                $splice: [[action.payload, 1]]
            })
            state.items = items
            state.total = items.reduce((previousValue, item) => previousValue + item.price, 0)
        }
    }
})

export const {addToCart, removeFromCart, toggleCart} = cartSlice.actions

export default cartSlice.reducer