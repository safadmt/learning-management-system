import React, { useEffect, useState } from 'react'
import Sidebar from '../../component/dashboared/Sidebar'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import CreateNewCourse from '../../component/instructorDashboard/createcourse/CreateNewCourse';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../api/slices/usersSlice';
import Header from '../../component/instructorDashboard/Header';
import ViewCourse from '../../component/instructorDashboard/ViewCourse';
import EditCourse from '../../component/instructorDashboard/EditCourse';
import EditInstructorInfo from '../../component/instructorDashboard/EditInstructorInfo';

function InstructorDashboared() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {userid} = useParams();
  const {user} = useSelector(state=> state.userInfo);

  const [sideBarList] = useState([
    {label: 'Courses', path:`/instructor/${user?._id}/`},
    {label: 'Add course', path:`/instructor/${userid}/create-new-course`},
    {label: 'Edit Instructor Info', path: `/instructor/${userid}/edit-instructor-info`}
  ])
  useEffect(()=> {
    if(!user) {
      dispatch(logout());
      Navigate('/login')
    }
  },[user])
  return (
    <div>
        
        <div>
        <div className='flex'>
            <Sidebar sidebarList={sideBarList}/>
            <div className='md:w-full sm:w-full'>
              <Routes>
                <Route path='/' element={<Header/>}/>
                <Route path='/create-new-course' element={<CreateNewCourse/>}/>
                <Route path='/course/:courseid' element={<ViewCourse/>}/>
                <Route path='/course/edit' element={<EditCourse/>}/>
                <Route path='/edit-instructor-info' element={<EditInstructorInfo/>}/>
              </Routes> 
            </div>
        </div>
        </div>
    </div>
  )
}

export default InstructorDashboared