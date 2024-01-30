import { createSlice } from "@reduxjs/toolkit";
import axios from '../config/instance'

const initialState = {
    list: [],
    loading: false
}

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setFavorite: ( state, action ) => {
            state.list = action.payload
        },
        setLoading: ( state, action ) => {
            state.loading = action.payload
        }
    }
})

export const { setFavorite, setLoading } = favoriteSlice.actions

export const fetchFavorite = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.get('/list')
        dispatch(setFavorite(data))
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setLoading(false))
    }
}

export default favoriteSlice.reducer