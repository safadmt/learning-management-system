import React, { useState } from 'react'
import ReviewsandRating from './ReviewsandRating'
import CourseFeedbackFrom from './CourseFeedbackFrom'
import { IoClose } from 'react-icons/io5'
import { useCourseFeedbackMutation } from '../../api/course'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../../api/slices/courseSlice'
import AverageRating from './AverageRating'

function CourseReviews({course}) {
    const dispatch = useDispatch()
    const [showFeedbackform , setShowFeedbackForm] = useState(false)
    const {user} = useSelector(state=> state.userInfo)
    const [submitFeedback] = useCourseFeedbackMutation();

    
    const handleSubmitFeedback = (rating, comment)=> {
        submitFeedback({rating,comment,courseId:course?._id, userId:user._id})
        .unwrap()
        .then(response=> {
            toast.success("Your feedback submitted, Thank you for your valuable feeback", {
                position: toast.POSITION.TOP_RIGHT
            })
        })
        .catch(err=> {
            if(err.status === 500 || err.status === 403) {
                dispatch(setError(err))
            }else{
                switch (err.status) {
                case 400:
                    toast.error(err.data, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    break;
                default:
                    console.log(err);
                    toast.error(err.data || err.description, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    break;
            }
            }
            
        })
    }
  return (
    <div className='px-6 py-4 relative'>
        <h6 className='font-medium text-4xl pb-4'>Students Feedback</h6>
        <AverageRating courseid={course._id}/>
        <div className=''>

            <h6 className='font-medium text-2xl'>Reviews</h6>
            
            {showFeedbackform && <div className='z-10 absolute p-2 w-3/5 top-0 pb-6 bg-[#D3D3D3]'>
            <div><IoClose size={25} onClick={()=> setShowFeedbackForm(false)} className='float-right'/></div>
            <CourseFeedbackFrom submitFeedback={handleSubmitFeedback}/></div>}
            <div className='text-right'>
                 <p className='hover:cursor-pointer hover:text-[#333333] font-medium'
                 onClick={()=> setShowFeedbackForm(true)}>Give a feedback? Click here</p>
            </div>
           
        </div>
        
        <ReviewsandRating course={course}/>
    </div>
  )
}

export default CourseReviews