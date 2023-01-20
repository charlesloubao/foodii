import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {StripeError} from "@stripe/stripe-js";

const errorReducer = createSlice({
    name: "error",
    initialState: {},
    reducers: {
        onError(state, action: PayloadAction<Error | StripeError>) {
            const error = action.payload
            const appError: Error = new Error("An error occurred", {cause: error})
            console.error(appError)
            alert(error.message ?? "An error occurred")
        }
    }
})

export const {onError} = errorReducer.actions

export default errorReducer.reducer