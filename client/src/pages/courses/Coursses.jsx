import React, { useEffect } from 'react'
import './courses.css';
import { useParams, useSearchParams } from 'react-router-dom'
import DisplayCourses from '../../component/courses/DisplayCourses';

import { useDispatch, useSelector } from 'react-redux';
import {  setCurrentPage } from '../../api/slices/globalSlice';
import FilterCourse from '../../component/courses/FilterCourse';
import Pagination from '../../component/pagination/Pagination';



function Coursses() {


    const dispatch = useDispatch();
    const [searchParams,setSearchParams] = useSearchParams()
    const search_params = useSelector(state=> state.globalSlice.search_params);
    const {filtercategories} = useSelector(state=> state.globalSlice);

    useEffect(()=> {
      return ()=> {
        dispatch(setCurrentPage(1))
      }
    },[])
    
    useEffect(()=> {
      
      if(search_params?.rating) {
        
        searchParams.set('rating', search_params.rating);
        let newURl = `${window.location.pathname}?${searchParams.toString()}`
        window.history.pushState({},'', newURl)
      }
      if(search_params?.price) {
        searchParams.set('price', search_params.price);
        let newURl = `${window.location.pathname}?${searchParams.toString()}`
        window.history.pushState({},'', newURl)
      }
      
    },[search_params])
    
    useEffect(()=> {
      let cnames = []
     
      if(Array.isArray(filtercategories) && filtercategories.length > 0) {
          
          filtercategories.map(category=> {
            cnames.push(category.cname)
          })
          setSearchParams({...search_params,category: cnames})
          
      }else{
        if(search_params !== null) {
          setSearchParams(search_params)
        }
      }
  },[filtercategories])
   
  
  return (
    <div className='ps-8' id='coursespagemaindiv'>
        <FilterCourse/>
        <div id='coursepaginationsectiondiv'>
          <DisplayCourses/>
           <Pagination/>
        </div>
       
    </div>
  )
}

export default Coursses