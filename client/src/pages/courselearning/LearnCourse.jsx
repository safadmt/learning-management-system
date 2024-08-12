import React, { useEffect } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useGetCourseQuery } from '../../api/course';
import Loading from '../../component/Loading';
import ErrorPage from '../ErrorPage';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../../api/slices/usersSlice'
import LessonSidebar from '../../component/watchcourse/LessonSidebar';
import LessonVideoPlayer from '../../component/watchcourse/LessonVideoPlayer';
import { useGetUserQuery } from '../../api/user';
import { toast } from 'react-toastify';
import CourseHeader from '../../component/watchcourse/CourseHeader';
import CourseDashboared from '../../component/watchcourse/CourseDashboared';
import CourseOverview from '../../component/watchcourse/CourseOverview';
import CourseReviews from '../../component/watchcourse/CourseReviews';
import QsAndAns from '../../component/watchcourse/QandReply/QsAndAns';

function LearnCourse() {
  let content;
  const {courseId} = useSelector(state=> state.courseInfo);
  const {user} = useSelector(state=> state.userInfo)
  const errorInfo = useSelector(state=> state.courseInfo.error);
  const dispatch = useDispatch();
  const Navigate = useNavigate()
  const {data:userInfo, isLoading: isUserLoading, isFetching: isUserFetching, isError:isUserError,
  isSuccess:isUserSuccess, error:userError,refetch} = useGetUserQuery(user?._id)
  const {data:course,isLoading,isFetching,isError,isSuccess,error} = useGetCourseQuery(courseId);
  
  useEffect(()=> {
    refetch() 
  },[refetch])

  useEffect(()=> {
    if(isUserLoading || isUserFetching) {
      content = <Loading/>
    }else if(userInfo && course && isUserSuccess) {
      if(course?.fee_status === "Paid") {
      if(userInfo?.enrolled_courses?.length >= 0)  {
        console.log(course);
        console.log(userInfo.enrolled_courses)
        const isTrue = userInfo.enrolled_courses.some(encourse => encourse.courseId === course._id)
        if(!isTrue) {
          toast.error("Access denaid!. Kindly pay course", {
            position: toast.POSITION.TOP_RIGHT
          })
          
        }
      }else {
        toast.error("Access denaid!. Kindly pay course", {
          position: toast.POSITION.TOP_RIGHT
        })
       
      }
    }
    }
    
    // return ()=> {
    //   dispatch(removeLesson())
    // }
  },[userInfo,course,isUserSuccess,isUserLoading,isUserFetching])
    const handleErrors = (error) => {
        switch(error.status) {
          case 500:
            content = <ErrorPage/>
            break;
          case 403:
            dispatch(logout())
            Navigate('/login')
            break;
          case 404:
            toast.error(error.data, {
              position: toast.POSITION.TOP_RIGHT
            })
            break;
          default:
            break;
        }
      }
  useEffect(()=> {
    if(errorInfo) {
      handleErrors(errorInfo)
    }
  },[errorInfo])
  
  if(isLoading && isUserLoading) {
    content = <Loading/>
  }else if(isFetching && isUserFetching) {
    content = <Loading/>
  }else if(isError) {
    handleErrors(error)
  }else if(isUserError) {
    handleErrors(userError)
  }

  
  
  return (
    <div> 
      {content ? content :isSuccess && isUserSuccess && <div className='flex'>
        
         <div className='relative'>
           <LessonSidebar course={course} userInfo={userInfo}/> 
         </div>
         <div className='w-full'>
          <CourseHeader userInfo={userInfo} course={course}/>

          <LessonVideoPlayer/>
          <CourseDashboared course={course}/>
          <div>
            <Routes>
              <Route path='/' element={<CourseOverview course={course}/>}/>
              <Route path='/reviews' element={<CourseReviews course={course}/>}/>
              <Route path='/Q&A_section' element={<QsAndAns course={course}/>}/>
            </Routes>
          </div>
         </div>
         
      </div>
     }
      
    </div>
  )
}

export default LearnCourse