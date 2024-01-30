import { createSlice } from "@reduxjs/toolkit";
import axios from '../config/instance'

const initialState = {
    detail: {},
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: ( state, action ) => {
            state.detail = action.payload
        },
        setLoading: ( state, action ) => {
            state.loading = action.payload
        }
    }
})

export const { setUser, setLoading } = userSlice.actions

export const fetchUser = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await axios.get('/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.access_token}`
            }
        })
        if(data){
            dispatch(setUser(data))
        } // ganti ke endpoint favorite
    } catch (error) {
        console.log(error)
    } finally {
        dispatch(setLoading(false))
    }
}

export default userSlice.reducer