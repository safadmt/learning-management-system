import React from 'react'

import { AWS_S3_DOMAIN_NAME } from '../../config'

function Course({course,goTo}) {

  return (
    <div id='coursecomponent' className='transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'>
            <div className='relative hover:cursor-pointer' onClick={()=>goTo(course.title, course.courseId)}>
              <img src={`${AWS_S3_DOMAIN_NAME}/${course?.course_image}`}
                alt='lesson_image' style={{ width: '100%', height: '125px' }} />

            </div>
            <div className='p-2 leading-5 text-black bg-[#B6BBC4]'>
              <p className='truncate'>{course.title}</p>
              <p>{course.fee_status === "Paid" ? course.course_fee : "Free"} </p>
            </div>

          </div>
  )
}


export default Course