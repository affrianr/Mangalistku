import { createSlice } from '@reduxjs/toolkit'
import axios from '../config/instance'

const initialState = {  // gunakan array karena data bnyak dan akan di map untuk menampilkan data di html
  list: [],
  loading: false
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: ( state, action ) => {
        state.list = action.payload
    },
    setLoading: (state, action ) => {
        state.loading = action.payload
    }
  },
})



// Action creators are generated for each case reducer function
export const { setLogin, setLoading } = loginSlice.actions 


// tujuan untuk antisipasi ketika akan digunakan di component lain
export const loginPage = () => async (dispatch) => {
    //di sini ada dispatch karena dibalik layar redux toolkit sudah pasang redux thunk
    try {
        dispatch(setLoading(true))
        const { data } = await axios.post('/login')
        dispatch(setLogin(data))

    } catch (error) {
        console.log(error, '------- error di fetchTodos')
    } finally {
        dispatch(setLoading(false))
    }
  }

export default loginSlice.reducer