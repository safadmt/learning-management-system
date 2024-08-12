import React from 'react'

function CourseOverview({course}) {
  return (
    <div className='p-6'>
        <h1 className='font-medium text-4xl pb-2'>About this Course</h1>
        <p>{course?.description}</p>

        <p className='font-medium text-xl py-4'>Number students enrolled : {course?.enrolled_users?.length}</p>
    </div>
  )
}

export default CourseOverview