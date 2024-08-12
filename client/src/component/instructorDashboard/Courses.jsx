import React from 'react'
import DisplayInstructorCourse from './DisplayInstructorCourse'
import { useGetInstructorCoursesQuery } from '../../api/course'
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import { useNavigate, useParams } from 'react-router-dom';
import Course from '../dashboared/Course';

function Courses() {


  const Navigate = useNavigate()
  const {userid} = useParams();
    let content;
    const {data:courses, isError, isLoading ,isSuccess,refetch} = useGetInstructorCoursesQuery(userid);
    
    if(isLoading) {
      content = <Loading/>
    }else if(isError) {
      console.log(isError)
      content = <ErrorPage/>
    }else if (isSuccess) {
      console.log(isSuccess)
    }
    console.log(courses)
  return (
    <div>
        {content ? content : <div>
          <div className='mx-auto  flex flex-wrap items-center justify-center mt-6'>
           
            {courses?.length > 0 ? courses.map((course,index)=> {
              return <Course key={index} course={course} goTo={()=> Navigate(`/instructor/${userid}/course/${course._id}`)}/>
            }) : <p className='text-center py-6 font-medium'>No courses created yet</p>}
            
        </div>
        </div>}
        
        
    </div>
  )
}

export default Courses