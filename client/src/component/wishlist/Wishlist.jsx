import React, { useEffect } from 'react'
import './wishlist.css';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useGetUserWishlistDetalsQuery } from '../../api/user';
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import { logout } from '../../api/slices/usersSlice';
import Displaywishlist from '../instructorDashboard/DisplayInstructorCourse';
import { closeWishlistComponent } from '../../api/slices/globalSlice';

function Wishlist() {
    let content;
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state=> state.userInfo);

    useEffect(()=> {
       if(!user) {
        Navigate('/login')
    } 
    },[user,Navigate])
    
    const {data:wishlist, isLoading, isError,isSuccess,error} = useGetUserWishlistDetalsQuery(user?._id)
    
    if(isLoading) {
        content = <Loading/>
    }else if(isError) {
        switch (error.status) {
            case 500:
                content = <ErrorPage/>
                break;
            case 403:
                dispatch(logout())
                Navigate('/login')
            default:
                console.log(error.data)
                break;
        }
    }else if(isSuccess) {
        content = wishlist.map((course, index) => (
            <Displaywishlist key={index} course={course} path={`/course/${course.course_id}`} />
        )) 
    }
   
  return (
    <div style={{width:"600px"}} id='wishlist' onMouseLeave={()=> dispatch(closeWishlistComponent())}>
        
        <div className='mx-auto'>
            {content.length > 0 ? content : 
            <p className='font-medium text-black text-center py-2'>Your wishlist is empty</p>}
        </div>
        
    </div>
  )
}

export default Wishlist