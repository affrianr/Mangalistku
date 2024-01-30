import { configureStore } from "@reduxjs/toolkit";
import favoriteSlice from "./features/favoriteSlice";
import mangaSlice from "./features/mangaSlice";
import mangaListSlice from './features/listSlice'
import detailSlice from './features/detailSlice'
import userSlice from "./features/userSlice";

const store = configureStore({
    reducer: {
        manga: mangaSlice,
        favorite: favoriteSlice,
        mangaList: mangaListSlice,
        detail: detailSlice,
        user: userSlice
    }
})

export default store