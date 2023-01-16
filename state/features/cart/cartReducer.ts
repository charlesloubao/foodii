import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import update from 'immutability-helper';
import {CartItem} from "../../../data/CartItem";
import {Cart} from "../../../data/Cart";
import {Restaurant} from "../../../data/Restaurant";

export type CartState = {
    data: Cart | null,
    cartLoading: boolean,
    showCart: boolean,
    currentRestaurant: Restaurant | null
}

const initialState: CartState = {
    data: null,
    cartLoading: true,
    showCart: false,
    currentRestaurant: null
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartLoading(state: CartState, action: PayloadAction<boolean>) {
            state.cartLoading = action.payload
        },
        setCurrentRestaurant(state: CartState, action: PayloadAction<Restaurant | null>) {
            state.currentRestaurant = action.payload
        },
        onCartUpdated(state: CartState, action: PayloadAction<Cart | null>) {
            state.data = action.payload
        },
        toggleCart(state: CartState) {
            state.showCart = !state.showCart
        },
    }
})

export const {onCartUpdated, setCartLoading, setCurrentRestaurant, toggleCart} = cartSlice.actions

export default cartSlice.reducer