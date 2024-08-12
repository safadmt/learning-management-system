import React from 'react'
import EditCourse from './EditCourse'
import { useParams } from 'react-router-dom'
import AddandViewCourse from './addandviewcourse/AddandViewCourse';

function ViewCourse() {
    const {courseid} = useParams();
  return (
    <div>
        <AddandViewCourse courseId={courseid}/>
    </div>
  )
}

export default ViewCourse