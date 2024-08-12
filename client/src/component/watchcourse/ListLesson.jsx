import React from 'react'
import { MdOndemandVideo } from "react-icons/md";

function ListLesson({lesson,lessonIndex}) {
  return (
    <div className={'grid my-2 grid-cols-9 w-max bg-white border-2 rounded-full'}>
        <div className={'text-center'}>
            <p className='font-medium text-lg py-2'>{lessonIndex + 1}</p>
        </div>
        <div>
          <MdOndemandVideo className='mt-2' size={35}/>
        </div>
        <div className='col-span-7'>
            <p className='font-medium mt-2'>{lesson?.description}</p>
        </div>
    </div>
  )
}

export default ListLesson