import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSetLessonCompeltedStatusMutation } from '../../api/user';
import { handleLessonCompleted } from '../../api/slices/courseSlice';
import { logout } from '../../api/slices/usersSlice';
import { useNavigate } from 'react-router-dom';

function CourseHeader({userInfo,course}) {
    const dispatch = useDispatch();
    const Navigate = useNavigate()

    const {lesson} = useSelector(state=> state.courseInfo);
    const [islessonCompleted , setIsLessonCompleted] = useState(false)
    const [setLessonCompletionstatus] = useSetLessonCompeltedStatusMutation();


    useEffect(()=> {
       
        const courseInfo = userInfo.enrolled_courses?.find(obj=> obj.courseId === course?._id)
    
        setIsLessonCompleted(courseInfo?.lessonscompleted?.some(obj=> obj === lesson?._id))
    },[userInfo,lesson])
    
    
    const handleLessonStatus = async() => {
        
        if(userInfo && course && lesson) {
       
             setLessonCompletionstatus({userId: userInfo._id,status:islessonCompleted ? 1 : 0,
            courseId: course._id, lessonId:lesson._id})
        .unwrap()
        .then(response=> {
            dispatch(handleLessonCompleted({lessonId:lesson._id,status: islessonCompleted ? 1 : 0}))
            setIsLessonCompleted(!islessonCompleted)
        })
        .catch(err=> {  
            switch (err.status) {
                case 403:
                    dispatch(logout())
                    Navigate('/login')
                    break;
                default:
                    console.log(err.data)
                    break;
            }
        })
        }
        
    }
  return (
    <div className='py-2 px-4 bg-[#637E76] flex text-white flex-wrap'>
        <div>{lesson?.description}</div>
        <div className='ml-auto w-30 hover:cursor-pointer' 
        onClick={handleLessonStatus}>{islessonCompleted ? "set as incomplete" : "set as complete"}</div>
    </div>
  )
}

export default CourseHeader