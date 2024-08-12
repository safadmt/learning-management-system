import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";


const usersSlice = createSlice({
    name: 'auth',
    initialState: {
        user : (localStorage.getItem('userInfo') !== null && localStorage.getItem('userInfo') !== "undefined") ?
         JSON.parse(localStorage.getItem('userInfo')) : null
        
    },
    reducers: {
        setCredential : (state,action)=> {
            state.user = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout : (state, action)=> {
            state.user = null
            localStorage.removeItem('userInfo')
            
        }
    }
})

export const {setCredential, logout} = usersSlice.actions;
export default usersSlice.reducer