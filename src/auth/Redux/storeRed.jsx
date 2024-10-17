import { configureStore } from "@reduxjs/toolkit";
import authSliceRed from "./authSliceRed";


export const store = configureStore({
    reducer:{
        auth: authSliceRed,
    }
})