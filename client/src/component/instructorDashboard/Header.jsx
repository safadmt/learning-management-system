import React from 'react'
import Courses from './Courses'

function Home() {
  return (
    <div id='Instructordashboared'>
        <div className='bg-[#234391] text-white h-40 text-center flex flex-col justify-center items-center'>
                <p className='font-medium text-2xl'>Instructor Dashboared</p>
        </div>
        <Courses/>
    </div>
  )
}

export default Home