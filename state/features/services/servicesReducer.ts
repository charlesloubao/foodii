import OrderService from "../../../services/orderService";
import {createSlice} from "@reduxjs/toolkit";

export type ServicesState = {
    orderService: OrderService
}

export const initialState: ServicesState = {
    orderService: new OrderService()
}

export const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {}
})

export default servicesSlice.reducer