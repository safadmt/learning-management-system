import React, { useEffect } from 'react'
import StarRating from 'react-star-ratings';
import { useGetCourseFeedbacksQuery } from '../../api/course';
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/slices/usersSlice';

function ReviewsandRating({course}) {
  let content = null;
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {data:feedbacks, isLoading,isFetching,isError,error,isSuccess} = useGetCourseFeedbacksQuery(course._id)
 
  if(isLoading || isFetching) {
    content = <Loading/>
  }else if(isError) {
    switch (error.status) {
      case 500:
        console.log(error.data)
        content = <ErrorPage/>
        break;
      case 400: 
        console.log(error.data)
        break;
      case 403:
        dispatch(logout());
        Navigate('/login')
        break
      default:
        break;
    }
  }
  return (
    <div>
    {content ? content : isSuccess && feedbacks?.length > 0 ? feedbacks.map((feedback,index)=> (
      <div className='my-2 py-2 mx-2' key={index}>
        <h6 className='font-medium text-xl'>{feedback.user}</h6>
        <StarRating starDimension='20px' starSpacing='0px' starRatedColor='#b4690e' rating={feedback.rating || 0}/>
        <p>{feedback.comment}</p>
    </div>
    )) : <div className='my-2 py-2 mx-2'>No feedback avaiable , Be the first one to review this course</div> }
    
    </div>
  )
}

export default ReviewsandRating