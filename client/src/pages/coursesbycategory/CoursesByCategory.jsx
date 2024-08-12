import React, { useEffect, useMemo } from 'react'
import './coursebycategory.css'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import CoursesByCategorize from '../../component/coursesbycategories/CoursesByCategorize';
import Pagination from '../../component/pagination/Pagination';
import { setCurrentPage } from '../../api/slices/globalSlice';

function CoursesByCategory() {
    const {categoryname} = useParams();
    const dispatch = useDispatch()
    const {categoryId} = useSelector(state=> state.globalSlice)
    const {totalpages} = useSelector(state=> state.globalSlice)
    const {totalcourses} = useSelector(state=> state.globalSlice)
    const {totalcoursefetched} = useSelector(state=> state.globalSlice)
    const {currentpage} = useSelector(state=> state.globalSlice)

    useEffect(()=> {
      return ()=> {
        dispatch(setCurrentPage(1))
      }
    },[])

    const info = useMemo(()=> {
       
        if(categoryId !== 1) {
          return {id:categoryId,skip:false,page:currentpage,courseskip:false}
        }else {
          return {id: null , skip:true, courseskip: false,page:currentpage}
        }
        
      },[categoryId,currentpage])
    
  return (
    <div id='coursebycategorydiv'>
        <div>
          <div className='text-center text-4xl pt-20 pb-10'>
            {categoryname  ? <div>
              <h1>Courses in {categoryname}</h1>
              <h6 className='text-xl'>Courses : {totalcourses}</h6>
              </div>
             :<h1>All Courses</h1>}
          </div>
        
        <CoursesByCategorize info={info}/>
        <div id='paginationdiv' className='mx-auto'><Pagination/></div>
        
        </div>
    </div>
  )
}

export default CoursesByCategory