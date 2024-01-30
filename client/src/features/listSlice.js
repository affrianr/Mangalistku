import { createSlice } from "@reduxjs/toolkit";
import axios from '../config/instance'

const initialState = {
    list: [],
    loading: false
}

export const listSlice = createSlice({
    name: 'myList',
    initialState,
    reducers: {
        setMyList: ( state, action ) => {
            state.list = action.payload
        },
        setLoading: ( state, action ) => {
            state.loading = action.payload
        }
    }
})

export const { setMyList, setLoading } = listSlice.actions

export const fetchList = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.get('/list')
        dispatch(setMyList(data))
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setLoading(false))
    }
}

export default listSlice.reducer