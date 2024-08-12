import React, { useState } from 'react'
import StarRatings from 'react-star-ratings'
import SubmitButton from '../SubmitButton'
import { IoClose } from 'react-icons/io5'
import { toast } from 'react-toastify'
function CourseFeedbackFrom({submitFeedback}) {
    const [rating, setStarRating] = useState(0)
    const [comment,setComment] = useState("")

    const handleSubmit = (e)=> {
        e.preventDefault();
        if((rating === 0) || (rating === undefined) ) {
            toast.error("Rating cannot be null",{
                position: toast.POSITION.TOP_RIGHT
            })
        }else if(comment === "") {
            toast.error("Comment field required",{
                position: toast.POSITION.TOP_RIGHT
            })
        }else {
            submitFeedback(rating, comment)
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            
            <label className='block font-medium'>Your rating</label>
            <StarRatings starDimension='20px' starSpacing='0px' starEmptyColor='white'
             starRatedColor='#b4690e' rating={rating} starHoverColor='#b4690e'
             changeRating={(rating)=> setStarRating(rating)}/>
             <label className='py-2 block font-medium'>Comment</label>
             <textarea value={comment} rows={5} onChange={(e)=> setComment(e.target.value)}
              className='w-full border-4 p-2 text-black rounded'/>
             <SubmitButton btnname={"Submit"}/>
        </form>
    </div>
  )
}

export default CourseFeedbackFrom