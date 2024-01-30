import { createSlice } from "@reduxjs/toolkit";
import axios from '../config/instance'

const initialState = {
    list: [],
    loading: false
}

export const mangaListSlice = createSlice({
    name: 'mangaList',
    initialState,
    reducers: {
        setMangaList: ( state, action ) => {
            state.list = action.payload
        },
        setLoading: ( state, action ) => {
            state.loading = action.payload
        }
    }
})

export const { setMangaList, setLoading } = mangaListSlice.actions

export const fetchMangaList = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios({
            url: '/list',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.access_token}`
            }
        }) // ganti ke endpoint favorite
        dispatch(setMangaList(data))
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setLoading(false))
    }
}

export default mangaListSlice.reducer