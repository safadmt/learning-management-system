import React from 'react'
import { useNavigate} from 'react-router-dom';
import { AWS_S3_DOMAIN_NAME, BASE_URL } from '../../config';
import { MdOndemandVideo } from 'react-icons/md';


function DisplayInstructorCourse({course,path}) {

  const Navigate = useNavigate();
 
  return (
    <div className={'flex flex-row bg-[#637E76] rounded-full ralative my-2 px-4 transition hover:my-4 hover:scale-110  duration-300'} 
    style={{height: "114px"}} onClick={()=>Navigate(path)}>
        <div className='w-48 py-2'>
            <img src={`${AWS_S3_DOMAIN_NAME}/${course.course_image}` } 
            style={{width: "90px", height:"90px" , borderRadius:"50%"}}
            alt='course image'/>
        </div>
        <div className=''>
           
            <p className='font-medium mt-2 text-xl'>{course?.title}</p>
            <p>{course.fee_status === "Paid" ? course.course_fee : "Free"} </p>
        </div>
    </div>
  )
}

export default DisplayInstructorCourse