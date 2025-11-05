import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: '',
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.token = action.payload.token
    },
  },
})

export const { setAuth } = authSlice.actions

export default authSlice.reducer