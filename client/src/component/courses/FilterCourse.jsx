import React, { useEffect, useMemo, useState } from 'react'
import './course.css'
import { useGetCategoriesQuery } from '../../api/admin'
import {useSearchParams} from 'react-router-dom'
import { IoIosArrowDown } from "react-icons/io";
import StarRatings from 'react-star-ratings'
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId, setUrlSearchParams , clearFilter, setCurrentPage} from '../../api/slices/globalSlice';
import FilterCategoryCheckbox from './FilterCategoryCheckbox';

function FilterCourse() {

    const [searchParams, setSearchParams] = useSearchParams() 
    let rating = searchParams.get('rating');

    const {data:categories,isError,isSuccess} = useGetCategoriesQuery()
    const [radioStartRating, setRadioStarRating] = useState(rating || 0)
    const [filterPrice, setFilterPrice] = useState("")
    const [filterCheckbox, setFilterCheckbox] = useState([])
    const [showFilterbar, setShowFilterBar] = useState(true)
    const {search_params} = useSelector(state=> state.globalSlice)
    const {categoryId} = useSelector(state=> state.globalSlice)
    const dispatch = useDispatch();
    const [ratings, setRating] = useState([{rating: 4.5 ,checked:false, label: "4.5 or above" },
                                {rating: 4.0,checked:false, label:'4.0 or above'},
                                {rating: 3.5,checked:false, label:'3.5 or above'},
                                {rating: 3.0,checked:false, label:'3.0 or above'}])
    
    
    
   
    useEffect(()=> {
        if(Array.isArray(categoryId)) {
            setFilterCheckbox([...categoryId])
        }else{
            setFilterCheckbox([...filterCheckbox,categoryId])
        }
    },[categoryId])

    useEffect(()=> {
        window.addEventListener('resize', function () {
            
            if(window.innerWidth <= 600) {
                setShowFilterBar(false)
            }else if(window.innerWidth >= 600)  {
                setShowFilterBar(true)
            }
        })
    },[])

    const categorydata = useMemo(()=> {
        if(isSuccess && categories) {
            
            return {categories:categories,isSuccess:true}
        }else{
            return {categories:[],isSuccess:false}
        }
    },[isSuccess, categories])

    
    const handleBtnClick = (e)=> {
        e.preventDefault();
       
        if(window.innerWidth <= 600) {
            setShowFilterBar(!showFilterbar)
            
        }
    }
    const handleRadioRating = (rating)=> {
        setRadioStarRating(rating)
        dispatch(setCurrentPage(1))
        dispatch(setUrlSearchParams({...search_params,rating:rating}))
    }
    const handleFilterPrice = (data)=> {
        setFilterPrice(data)
        dispatch(setCurrentPage(1))
        dispatch(setUrlSearchParams({...search_params, price:data}))
    }
    const handleFetchCourse = (e) => {
        e.preventDefault();
        
    }

    const clearFilters = ()=> {
        
        setRadioStarRating(0);
        dispatch(clearFilter())
    }
  return (
    <div id='filterdiv'>
        <div className='flex flex-wrap font-medium text-2xl pb-2'>
            <button className='flex flex-wrap gap-x-1' onClick={handleBtnClick}>FILTERS
            <IoIosArrowDown size={35}/></button>
            <button className='hover:bg-blue-700 px-4 py-1 hover:text-white border-2 rounded-full' 
            onClick={clearFilters}>Clear</button>
            </div>
        {showFilterbar && <div>
            <div>
                <h5 className='font-medium text-xl'>Rating</h5>
                <ul className='ps-2 font-medium'>
                    {ratings.map((rating,index)=> (
                        
                        <li className='py-1' key={index}>
                        <input type='radio' 
                        value={rating.rating}
                        checked={radioStartRating == rating.rating}
                        onChange={()=> handleRadioRating(rating.rating)}
                        className='mr-2' /><StarRatings 
                        starRatedColor='#b4690e' 
                        starDimension='20px' 
                        starSpacing='0px'
                        rating={rating.rating}/> {rating.label}</li>
                    ))}
                </ul>
            </div>
            <div className='pt-2'>
                <h5 className='font-medium text-xl'>Price</h5>
                <ul className='hover:cursor-pointer ps-2 font-medium'>
                    <li onClick={()=> handleFilterPrice("Paid")}>Paid</li>
                    <li onClick={()=> handleFilterPrice("Free")}>Free</li>
                </ul>
            </div>
            <FilterCategoryCheckbox categorydata={categorydata}/>
            
        </div>}
    </div>
  )
}

export default FilterCourse