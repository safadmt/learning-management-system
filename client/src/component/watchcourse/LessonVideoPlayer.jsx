import React, { useEffect } from 'react'
import ReactPlayer from 'react-player'
import { AWS_S3_DOMAIN_NAME, BASE_URL } from '../../config'
import { useSelector } from 'react-redux';

function LessonVideoPlayer() {
    const {lesson} = useSelector(state=> state.courseInfo);
    
  return (
    <div>
        <ReactPlayer url={`${AWS_S3_DOMAIN_NAME}/${lesson?.learning_video}`} width={""} controls={true}/>
    </div>
  )
}

export default LessonVideoPlayer