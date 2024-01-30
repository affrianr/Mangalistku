import { createSlice } from "@reduxjs/toolkit";
import axios from '../config/instance'

const initialState = {
    detail: [],
    loading: false
}

export const detailSlice = createSlice({
    name: 'detail',
    initialState,
    reducers: {
        setDetail: ( state, action ) => {
            state.list = action.payload
        },
        setLoading: ( state, action ) => {
            state.loading = action.payload
        }
    }
})

export const { setDetail, setLoading } = detailSlice.actions

export const fetchDetail = (mangaId) => async (dispatch) => {
    try {
        console.log(mangaId, '============')
        dispatch(setLoading(true))
        const { data } = await axios.get(`/details/${mangaId}`)
        if(data){
            dispatch(setDetail(data))
        } 
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setLoading(false))
    }
}

export default detailSlice.reducer