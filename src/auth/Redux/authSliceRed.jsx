import { createSlice } from '@reduxjs/toolkit'

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const authSliceRed = createSlice({
    name:'auth',
    initialState:{
        user:userInfoFromStorage,
        isLoggedIn:!!userInfoFromStorage,
    },
    reducers:{
        loginSuccess:(state,action)=>{
            state.user = action.payload;
            state.isLoggedIn = true;
            localStorage.setItem("userInfo",JSON.stringify(action.payload))
        },
        logout:(state)=>{
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem("userInfo");
        }
    },
})

export const {loginSuccess,logout} = authSliceRed.actions;
export default authSliceRed.reducer;