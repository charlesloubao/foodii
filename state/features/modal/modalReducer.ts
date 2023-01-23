import {MenuItem} from "../../../data/MenuItem";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type AddToCartModalProps = {
    type: "add-to-cart",
    data: MenuItem
}

export type OrderingFromOtherRestaurantWarningProps = {
    type: "ordering-from-other-restaurant-warning",
    data: MenuItem
}

export type ModalProps = AddToCartModalProps | OrderingFromOtherRestaurantWarningProps

export type ModalState = {
    props?: ModalProps | null
}

const initialState: ModalState = {}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal(state: ModalState, action: PayloadAction<ModalProps>) {
            state.props = action.payload
        },
        closeModal(state) {
            state.props = null
        }
    }
})

export const {openModal, closeModal} = modalSlice.actions
export default modalSlice.reducer