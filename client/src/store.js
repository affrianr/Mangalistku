import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import listSlice from "./features/listSlice";

const store = configureStore({
    reducer: {
        login:  loginSlice,
        myList: listSlice
    }
})

export default store