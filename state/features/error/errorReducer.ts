import {createReducer} from "@reduxjs/toolkit/src";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const errorReducer = createSlice({
    name: "error",
    initialState: {},
    reducers: {
        onError(state, action: PayloadAction<Error>) {
            const appError: Error = new Error("An error occurred", {cause: action.payload})
            console.error(appError)
            alert(appError.message)
        }
    }
})

export const {onError} = errorReducer.actions

export default errorReducer.reducer