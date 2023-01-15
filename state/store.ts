import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartReducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import servicesReducer from "./features/services/servicesReducer";
import modalReducer from "./features/modal/modalReducer";
import errorReducer from "./features/error/errorReducer";

export const store = configureStore({
    reducer: {
        error: errorReducer,
        modal: modalReducer,
        cart: cartReducer,
        services: servicesReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector