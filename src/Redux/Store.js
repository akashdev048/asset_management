import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slice/authSlice'


export const Store = configureStore({
  reducer: {
    auth : authReducer,
  },
})