import React, { useEffect, useRef, useState } from 'react'
import './qandans.css'
import { AiOutlineLike } from "react-icons/ai";
import { SlDislike } from "react-icons/sl";
import React_Quill from './form/React_Quill';

function CardQandAns({handleReply,handleShowReply,question}) {
    const quetioncontentRef = useRef(null)

    const [className, setClassName] = useState("show-few-lines")
    const [buttonContent, setButtonContent] = useState("Read more")
    // function checkLines() {
    //     let fontSize = parseFloat(getComputedStyle(quetioncontentRef.current).fontSize);
    //     let numberOfLines = quetioncontentRef.current.scrollHeight / fontSize;
    
    //     console.log(numberOfLines)

    // }
    // useEffect(()=> {
    //     checkLines()
        
    // },[])
    const handleClick = ()=> {
      if(className.includes("show-few-lines")) {
        setClassName("read-more-line")
        setButtonContent("Read less")
      }else{
        setClassName("show-few-lines")
        setButtonContent("Read more")
      }
    }
  return (
    <div className='card-qandreply'>
            <h6>mtshafad@gmail.com</h6>
            <div>
                <p className={className} ref={quetioncontentRef}>{question?.question_text}</p>
                <button className='read-more' onClick={handleClick}>{buttonContent}</button>
            </div>
            <div className='question-info-div'>
              
              <div className='text-black text-sm mt-2 w-fit replybutton hover:cursor-pointer' 
                onClick={handleShowReply}>Reply
             </div>
              <div className='mt-2 text-blue-700 number-of-replies-btn hover:cursor-pointer' 
              onClick={()=>handleReply("hello") }>{question?.replies.length} replies</div>
            </div> 
            <div className='list-replies'>
              {question?.replies.length > 0 && question.replies.map((reply,index)=> (
                <div>
              <h6 className='font-medium text-[#857f7f]'>mtshafad@gmail.com</h6>
            <div>
                <p >{reply?.reply_text}</p>
            </div>
              </div>
              ))}
            </div>
        </div>
  )
}

export default CardQandAns