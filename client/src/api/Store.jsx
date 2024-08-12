import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import { emptySplitApi } from './emptySplitApi'
import usersSlice from './slices/usersSlice'
import courseSlice from './slices/courseSlice'
import globalSlice from './slices/globalSlice'
export const store = configureStore({
    reducer: {
        userInfo : usersSlice,
        courseInfo : courseSlice,
        globalSlice : globalSlice,
        [emptySplitApi.reducerPath] : emptySplitApi.reducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(emptySplitApi.middleware)
    }
})

export default store