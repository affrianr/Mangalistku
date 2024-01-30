import { createSlice } from "@reduxjs/toolkit";
import axios from '../config/instance'

const initialState = {
    list: [],
    loading: false
}

export const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        setManga: ( state, action ) => {
            state.list = action.payload
        },
        setLoading: ( state, action ) => {
            state.loading = action.payload
        }
    }
})

export const { setManga, setLoading } = mangaSlice.actions

export const fetchManga = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.get('/',
        {
            headers: {
                'Authorization': `Bearer ${localStorage.access_token}`
            }
        })
        if(data){
            dispatch(setManga(data.data))
        } // ganti ke endpoint favorite
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setLoading(false))
    }
}

export default mangaSlice.reducer