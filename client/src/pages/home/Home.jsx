import React from 'react'
import HomeTextContent from '../../component/home/HomeTextContent'

import '../../component/home/home.css'
import HandleCourses from '../../component/home/HandleCourses'

function Home() {
  return (
    <div className=''>
      <div id='hometextcontent'>
        <HomeTextContent/>  
      </div>
      <div className='ps-8'>
        <HandleCourses/>
      </div>
       
       
       
    </div>
  )
}

export default Home