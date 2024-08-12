import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { AWS_S3_DOMAIN_NAME } from '../../config';
import { setCourseId } from '../../api/slices/courseSlice';
import { useDispatch } from 'react-redux';
import Course from './Course';


function EnrolledCourses({ user }) {
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const [isTrue, setIstrue] = useState(false)

  useEffect(() => {

    if (user.enrolled_courses?.length > 0) {

      setIstrue(true)
    }
  }, [user])

  const goTo = (title, id) => {

    dispatch(setCourseId(id))
    Navigate(`/course/${title}/learn`)


  }
  return (
    <div className='flex items-center'>

      <div className='flex justify-start gap-2 flex-wrap pt-4 w-5/6'>

        {(isTrue && user.enrolled_courses?.length) > 0 ? user.enrolled_courses.map((course, index) => {
          return <Course key={index} course={course} goTo={goTo}/>
        }) : <div className='mx-auto mt-28'>
          <div>
            <h6 className='text-lg'>No courses enrolled</h6>
            <button className='px-4 py-2 text-white rounded bg-[#235391]'
              onClick={() => Navigate('/')}>Enroll now</button>
          </div>
        </div>}
      </div>

    </div>
  )
}

export default EnrolledCourses