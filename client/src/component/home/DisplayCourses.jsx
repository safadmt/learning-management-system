import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import {  useGetCoursesbyCateoryQuery } from '../../api/course'
import ErrorPage from '../../pages/ErrorPage';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useAddorRemoveFromWishlistMutation, useGetUserWishlistQuery } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import Course from './Course';

import { removeCategoryId, removeFilterCategoryCheckbox, removeUrlSearchParam, setCategoryId } from '../../api/slices/globalSlice';

function DisplayCourses({ category, skipcourses, limitcourses }) {

    const dispatch = useDispatch();
    const Navigate = useNavigate();

   
    const [wishlists, setWishlists] = useState([])
    const { user } = useSelector(state => state.userInfo);
    let content;
    const { data: courses = [], isError, isLoading, isSuccess } =
        useGetCoursesbyCateoryQuery({ categoryId: category?._id, skipcourses, limitcourses })

    const { data: userwishlist, isLoading: isWishListLoading, isError: isWishListError,
        isSuccess: isWishListSuccess, error: wishlisterro, refetch: refetchWishlist } = useGetUserWishlistQuery(user?._id)

    const [updateUserWishlist] = useAddorRemoveFromWishlistMutation()

    if (isLoading && isWishListLoading) {
        content = <Loading />
    } else if (isError) {

        content = <ErrorPage />
    }
    useEffect(() => {
        if (isSuccess && user) {

            setWishlists(userwishlist?.wishlist)
        } else {
            setWishlists([])
        }

    }, [isSuccess, user, userwishlist])

    const updateWishlist = async (courseId) => {

        if (user) {
            try {
                await updateUserWishlist({ userId: user._id, courseId })

            } catch (err) {
                console.log(err.data)
            }

        } else {
            Navigate('/login')
        }
    }

    const handleNavigation = ()=> {
       
        if(category) {
            Navigate(`/courses/${category.category_name}`)
            dispatch(setCategoryId(category._id))
        }else {
            Navigate('/courses')
            dispatch(removeUrlSearchParam())
            dispatch(removeCategoryId())
            dispatch(removeFilterCategoryCheckbox());
            
        }
    }
    return (
        <div className='mt-10'>
            {content ? content : isSuccess &&
                <div>
                    {category ? <div className='font-medium py-8 text-center dynamicfontforcoursehead'>Courses in
                        <span className='text-blue-500 dynamicfontforcoursehead'> {category.category_name}</span></div> :
                        <div className='font-medium py-8 text-center text-zinc-800 text-4xl dynamicfontforcoursehead'>All
                            <span className='text-blue-500 dynamicfontforcoursehead'> Courses</span></div>}
                    <div className='flex flex-wrap' id='displaycourse'>

                        {courses.response.map((course, index) => (

                            <Course course={course} updateUserWishlist={updateWishlist}
                                wishlistStatus={wishlists?.length > 0 ? wishlists.includes(course._id) : false}
                                key={index} path={`/course/${course._id}`} />
                        ))}
                        <IoIosArrowDroprightCircle color='black' 
                        size={60} id='arrowbutton'
                        onClick={handleNavigation} />
                    </div>
                </div>
            }

        </div>
    )
}

export default DisplayCourses