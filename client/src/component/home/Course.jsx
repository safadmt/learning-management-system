import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import { AWS_S3_DOMAIN_NAME } from '../../config';
import { FaHeart } from "react-icons/fa";
import './home.css'

function Course({course,path,wishlistStatus,updateUserWishlist}) {
    const [wishllistBtnColor, setWishListBtnColor] = useState(wishlistStatus === true ? "#ff4d4d" : '#B0B0B0')

    useEffect(()=> {
      setWishListBtnColor(wishlistStatus === true ? "#ff4d4d" : '#B0B0B0')
  
    },[wishlistStatus])
    
    const updateWishlist = (courseid)=> {
      updateUserWishlist(courseid);
    }
    
    return (
       
          <div id='coursecomponent' className='transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'>
              <div className='relative'>
                <FaHeart size={24} color={wishllistBtnColor} className='absolute right-6 top-4 hover:cursor-pointer'
                 onClick={()=>updateWishlist(course._id)} 
                 />
                 <Link to={path}><img src={`${AWS_S3_DOMAIN_NAME}/${course?.course_image}`} 
                  alt='lesson_image' style={{width: '100%', height: '125px'}}/></Link>
                  
              </div>
              <div className='p-2 leading-5 text-black bg-[#B6BBC4]'>
                   <p className='truncate'>{course.title}</p>
                  <p className='text-s'>By {course.username}</p>
                  <p>{course?.fee_status === "Paid" ? course.course_fee : "Free"} </p>
              </div>
             
          </div>
    
    )
}

export default Course