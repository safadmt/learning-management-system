import React from 'react'
import CourseInfo from '../../component/coursedetails/CourseInfo'
import Lessonlist from '../../component/coursedetails/Lessonlist'
import { useGetCourseQuery } from '../../api/course';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../component/Loading';
import ErrorPage from '../ErrorPage';
import { logout } from '../../api/slices/usersSlice';
import { useDispatch } from 'react-redux';
import PagenoteFound from '../../component/PagenoteFound';

function CourseDetails() {

    let content;

    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const {courseid} = useParams();
    
    const {data:course,isLoading,isError,error,isFetching,isSuccess } = useGetCourseQuery(courseid);
   
    if(isLoading) {
        content = <Loading/>
    }else if(isError) {
        switch(error.status) {
            case 403:
                dispatch(logout());
            Navigate('/login')
            break;
            case 404:
                console.log(error.message)
            content = <PagenoteFound/>
            break;
            default:
                console.log(error)
                content: <ErrorPage/>
                break;
        }
        
    }else if(isFetching) {
        content = <Loading/>
    }
    
  return (
    <div>
        {content ? content : isSuccess && <div>
            <CourseInfo course={course}/>
            <div>
               {course?.lessons?.length > 0 && <div className='py-4'>
                    <div className='mx-auto text-center font-medium text-xl'>{course?.lessons.length + " Lessons"}</div>
                </div>}
                <Lessonlist course={course}/>
            </div>
            
        </div> }
        
        
    </div>
  )
}

export default CourseDetails