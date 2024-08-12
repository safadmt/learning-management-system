import React, { useEffect, useState } from 'react'
import {CgProfile} from 'react-icons/cg'
import Sidebar from '../../component/dashboared/Sidebar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Form from '../../component/dashboared/Form'
import Account from '../../component/dashboared/Account'
import EditProfilePic from '../../component/dashboared/EditProfilePic'
import { useParams } from 'react-router-dom'
import { useGetUserQuery } from '../../api/user'
import { logout } from '../../api/slices/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import ErrorPage from '../ErrorPage'
import Loading from '../../component/Loading'

import DisplayImage from '../../component/DisplayImage'
import EnrolledCourses from '../../component/dashboared/EnrolledCourses'


function Dashboared() {

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {userid} = useParams();
  const {user} = useSelector(state=> state.userInfo);

  const [sidebarList] = useState([
    {label: 'Edit Profile', path:`/dashboared/${userid}`},
    {label: 'Enrolled courses', path: `/dashboared/${userid}/enrolled_courses`},
    {label: 'Edit Profile picture' , path: `/dashboared/${userid}/profile-photo`},
    {label: 'My learning', path: `/dashboared/${userid}/learning`},
    {label: 'Accout Settings', path:`/dashboared/${userid}/account`}
  ])
  console.log(userid)
  const [serverError, setServerError] = useState(false);

  const {data, error, isLoading} = useGetUserQuery(userid);

  useEffect(()=> {
    if(!user) {
      dispatch(logout());
      Navigate('/login')
    }
  },[user])
  let content;
  if(isLoading) {
    content = <Loading/>
  }else if(error) {
    console.log(error)
    if(error.status === 403) {
      dispatch(logout());
      Navigate('/login');
    }else if(error.status === 500) {
      content = <ErrorPage/>
    }
  }
    console.log(data)
    return (
    <div>
      {(isLoading || error) ? content : <div>
        <div className='bg-[#234391] h-56 text-center text-white flex flex-col justify-center items-center'>
                <p className='font-medium text-2xl'>User Dashboared</p>
                {data?.profile_pic ? <DisplayImage image={data.profile_pic}/> : <div className='mt-4 mx-auto'><CgProfile size={100}/></div>}
        </div>
        <div className='md:flex md:flex-row'>
            <Sidebar sidebarList={sidebarList}/>
            <div className='md:w-full sm:w-full'>
              <Routes>

                <Route path='/' element={<Form info={data}/>}/>
                <Route path='/enrolled_courses' element={<EnrolledCourses user={data}/>}/>
                <Route path='/account' element={<Account/>}/>
                <Route path='/profile-photo' element={<EditProfilePic image={data?.profile_pic}/>}/>
              </Routes>
            </div>
        </div>
        </div>}
   
    </div>
  )
   
}

export default Dashboared