import { createSlice } from "@reduxjs/toolkit";
import {useSearchParams} from 'react-router-dom'

const searchParams = new URLSearchParams(window.location.search);

const globalSlice = createSlice({
   
    name: 'globalSlice',
    initialState: {
        isWishlistComponentOpen: false,
        categoryId: (localStorage.getItem('categoryId') !== null && localStorage.getItem('categoryId') !== "undefined") ?
                JSON.parse(localStorage.getItem('categoryId')) : null,
        search_params: (localStorage.getItem('searchparams') !== null && localStorage.getItem('searchparams') !== "undefined") ?
                JSON.parse(localStorage.getItem('searchparams')) : null,
        filtercategories : (localStorage.getItem('filteredcategoryid') !== null && localStorage.getItem('filteredcategoryid') !== "undefined") ?
        JSON.parse(localStorage.getItem('filteredcategoryid')) : [],
        totalpages : 0,
        totalcourses: 0,
        totalcoursefetched: 0,
        currentpage : 1,
    },
    reducers: {
        setOpenwishlistComponent : (state,action)=> {
            state.isWishlistComponentOpen = true;
        },
        closeWishlistComponent : (state, action)=> {
            state.isWishlistComponentOpen = false
        },
        setUrlSearchParams : (state, action)=> {
            localStorage.setItem('searchparams', JSON.stringify(action.payload))
            state.search_params = action.payload
        },
        removeUrlSearchParam : (state, action)=> {
            localStorage.removeItem('searchparams', JSON.stringify(action.payload))
            state.search_params = {}
        },
        setCategoryId : (state, action)=> {
            localStorage.setItem('categoryId', JSON.stringify(action.payload))
            state.categoryId = action.payload
        },
        removeCategoryId : (state, action)=> {
            localStorage.removeItem('categoryId')
            state.categoryId = null
        },
        clearFilter : (state, action)=> {
            localStorage.removeItem('categoryId')
            state.categoryId = null
            localStorage.removeItem('filteredcategoryid')
            state.filtercategories = []
            localStorage.removeItem('searchparams')
            state.search_params = {}
        },
        filterCategoriesCheckbox : (state, action)=> {
            
            if(state.filtercategories.some(c=> c.id === action.payload.id)) {
                state.filtercategories = state.filtercategories.filter(c=> c.id !== action.payload.id)
                localStorage.setItem('filteredcategoryid', JSON.stringify(state.filtercategories))    
            }else{
                state.filtercategories.push(action.payload)
                localStorage.setItem('filteredcategoryid', JSON.stringify(state.filtercategories))
                
            }
              
            
        },
        removeFilterCategoryCheckbox : (state,action)=> {
            localStorage.removeItem('filteredcategoryid')
            state.filtercategories = []
        },
        setTotalpages : (state,action)=> {
            state.totalpages = action.payload
        },
        removeTotalpages : (state,action)=> {
            state.totalpages = 0
        },
        setTotalcourses : (state,action)=> {
            state.totalcourses = action.payload
        },
        removeTotalcourses : (state,action)=> {
            state.totalcourses = 0
        },
        setTotalPageandCourse : (state,action)=> {
            console.log(action.payload)
            state.totalcourses = action.payload.totalcourses
            state.totalpages = action.payload.totalpages
            state.totalcoursefetched = action.payload.totalcoursefetched
        },
        setCurrentPage : (state, action) => {
            state.currentpage = action.payload
        }
        
        
        
        
    }
})

export const {setOpenwishlistComponent,closeWishlistComponent,setUrlSearchParams,removeUrlSearchParam,
            setCategoryId, removeCategoryId,filterCategoriesCheckbox,
            removeFilterCategoryCheckbox,clearFilter,setTotalcourses,setTotalpages,removeTotalcourses,
        removeTotalpages,setTotalPageandCourse,setCurrentPage} = globalSlice.actions;
export default globalSlice.reducer;