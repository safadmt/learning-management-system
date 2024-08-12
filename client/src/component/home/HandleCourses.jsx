import React, { useState } from 'react'
import { useGetCategoriesQuery } from '../../api/admin'
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import DisplayCourses from './DisplayCourses';

function HandleCourses() {
    let content;
    const [skip_courses] = useState(1);
    const [limit_course] = useState(5)
    const [totapages,setTotalPages] = useState(1)
    const {data:categories, isLoading,isError,isSuccess} = useGetCategoriesQuery();
    if(isLoading) {
        content = <Loading/>
    }else if(isError) {
        content = <ErrorPage/>
    }
    
  return (
    <div className='relative'>
        {content ? content : categories.length > 0 &&
         <div >
            {categories.map((cateory,index)=> (
                <DisplayCourses category={cateory} skipcourses={skip_courses} limitcourses={limit_course} key={index}/>
            ))}
            
            <DisplayCourses setTotalpage={(pages)=> setTotalPages(pages)} category={null} skipcourses={skip_courses} limitcourses={limit_course}/>
        </div>}
        
    </div>
  )
}

export default HandleCourses