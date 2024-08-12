import React from 'react'
import { Link } from 'react-router-dom'

function CourseDashboared({course}) {
  return (
    <div className='border border-b-2'>
        <ul className='flex flex-wrap px-6 py-4 text-xl font-medium'>
            <li className='px-6 py-2'><Link to={`/course/${course?.title}/learn/`}>Overview</Link></li>
            <li className='px-6 py-2'><Link to={`/course/${course?.title}/learn/reviews`}>Reviews</Link></li>
            <li className='px-6 py-2'><Link to={`/course/${course?.title}/learn/Q&A_section`}>Q&A Section</Link></li>
        </ul>
    </div>
  )
}

export default CourseDashboared