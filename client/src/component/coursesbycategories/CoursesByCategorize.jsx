import React, { useEffect, useMemo, useState } from 'react'
import './coursebycategories.css'
import {  useGetCoursesbyCateoryQuery } from '../../api/course'
import Loading from '../Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Course from '../home/Course';
import { useAddorRemoveFromWishlistMutation, useGetUserWishlistQuery } from '../../api/user';
import { useGetCategoryByIdQuery } from '../../api/admin';

import { setTotalPageandCourse } from '../../api/slices/globalSlice';

function CoursesByCategorize({info}) {
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [wishlists, setWishlists] = useState([])
 
    
    const { user } = useSelector(state => state.userInfo);
    

    let content;
   
    const {data: allCourse,isLoading:isCourseLoading,isError:isCourseError,error:CourseError,isSuccess:isCourseSuccess} = 
    useGetCoursesbyCateoryQuery({ categoryId: info?.id, skipcourses:info?.page, limitcourses:12}, {skip:info?.courseskip})

    const {data:category, isLoading:isCategoryLoading, 
        isSuccess:isCategorySuccess,isError:isCategoryError,
        error:categoryError} = useGetCategoryByIdQuery(info?.id, {skip: info?.skip})

    


    const { data: userwishlist, isLoading: isWishListLoading, isError: isWishListError,
        isSuccess: isWishListSuccess, error: wishlisterro, refetch: refetchWishlist } = useGetUserWishlistQuery(user?._id)

    const [updateUserWishlist] = useAddorRemoveFromWishlistMutation()

    if (isWishListLoading && isCategoryLoading) {
        content = <Loading />
    }

    useEffect(()=> {
        if(allCourse) {
            let {totalpages, totalcourses,totalcoursefetched} = allCourse
            dispatch(setTotalPageandCourse({totalpages,totalcoursefetched,totalcourses}))
            
        }
    },[allCourse])
    
    useEffect(() => {
        
        if (isWishListSuccess && user) {
            setWishlists(userwishlist?.wishlist)
        } else {
            setWishlists([])
        }

    }, [isWishListSuccess, user, userwishlist])

    
    const updateWishlist = async (courseId) => {

        if (user) {
            try {
                await updateUserWishlist({ userId: user._id, courseId })

            } catch (err) {
                console.log(err)
            }

        } else {
            Navigate('/login')
        }
    }
    
  return (
    <div id='maindiv'>
        { content ? content : allCourse?.response?.length > 0 && <div id='coursesdiv'>
            {allCourse.response.map((course,index)=> (
                <Course key={index} course={course} path={`/course/${course._id}`}
                wishlistStatus={wishlists?.length > 0 ? wishlists.includes(course._id) : false} 
                updateUserWishlist={updateWishlist}/>
            ))}
            
        </div>}
    </div>
  )
}

export default CoursesByCategorize