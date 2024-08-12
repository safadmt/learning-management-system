import React from 'react'
import ListLesson from '../watchcourse/ListLesson'

import './coursedetails.css'
import AboutInstructor from './AboutInstructor'
function Lessonlist({course}) {
  return (
    <div className='course-section'>
        
        <div className='lessondiv'>
            {course?.lessons.map((lesson,index)=> (
                <ListLesson key={index} lessonIndex={index} lesson={lesson}/>
            ))}
        </div> 
       <AboutInstructor/>
        
    </div>
  )
}

export default Lessonlist