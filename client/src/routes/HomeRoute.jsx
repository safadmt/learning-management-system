import React from 'react'
import './style.css'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/home/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NavbarCom from '../component/navbar/NavbarCom';
import Dashboared from '../pages/user/Dashboared';
import TeacherHome from '../pages/teachonCodefreak/TeacherHome';
import InstructorDashboared from '../pages/instructorDashboared/InstructorDashboared';
import CourseDetails from '../pages/viewcourse/CourseDetails';
import LearnCourse from '../pages/courselearning/LearnCourse';
import Wishlist from '../component/wishlist/Wishlist';
import Coursses from '../pages/courses/Coursses';
import CoursesByCategory from '../pages/coursesbycategory/CoursesByCategory';
import ForgotPassword from '../pages/forgotpassword/ForgotPassword';
import Profile from '../pages/instructorprofile/Profile';



function HomeRoute() {
  return (
    
    <div id='homeRout'>
      
        <NavbarCom/>
        <Routes>
            
            <Route path='/' element={<Home/>}/>
            <Route path='/course/:courseid' element={<CourseDetails/>}/>
            <Route path='/course/:coursetitle/learn/*' element={<LearnCourse/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/dashboared/:userid/*' element={<Dashboared/>}/>
            <Route path='/teacher' element={<TeacherHome/>}/>
            <Route path='/instructor/:userid/*' element={<InstructorDashboared/>}/>
            <Route path='/wishlist/:userid' element={<Wishlist/>}/>
            <Route path='/courses/:categoryname' element={<CoursesByCategory/>}/>
            <Route path='/courses' element={<Coursses/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/user/profile/:userid' element={<Profile/>}/>
        </Routes>
    </div>
  )
}

export default HomeRoute;