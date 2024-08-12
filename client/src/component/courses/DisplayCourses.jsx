import React, { useEffect, useMemo, useState } from 'react'
import './course.css'
import { useGetAllCourseQuery, useGetCoursesMutation, useGetCoursesbyCateoryQuery, useSearchCoursesMutation } from '../../api/course'
import Loading from '../Loading';
import ErrorPage from '../../pages/ErrorPage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Course from '../home/Course';
import { useAddorRemoveFromWishlistMutation, useGetUserWishlistQuery } from '../../api/user';
import { useGetCategoryByIdQuery } from '../../api/admin';
import { removeError, setCourses, setError } from '../../api/slices/courseSlice';
import { toast } from 'react-toastify';
import { setCurrentPage, setTotalPageandCourse, setTotalcourses, setTotalpages } from '../../api/slices/globalSlice';

function DisplayCourses() {

    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [wishlists, setWishlists] = useState([])
    
    
    const { user } = useSelector(state => state.userInfo);
    const {coursesdata} = useSelector(state=> state.courseInfo)
    const {search_params} = useSelector(state=> state.globalSlice)
    const {filtercategories} = useSelector(state=> state.globalSlice);
    const {currentpage} = useSelector(state=> state.globalSlice);
    
    

    const [getsearchCourses ,{isLoading:isSearchLoading}] = useSearchCoursesMutation();
    const [getCourses,{isLoading}] = useGetCoursesMutation()


    useEffect(()=> {
        let info = {}
        console.log(currentpage)
        info.rating =search_params?.rating ? search_params.rating : null;
        info.price = search_params?.price ? search_params.price : null
        info.categoryIds = filtercategories.length > 0 ?  filtercategories.map(category=> category.id) : []
        if((search_params !== null && search_params !== 'undefined') && 'search' in search_params) {
            getsearchCourses({text_search:search_params.search,limit:12,rating:info.rating,
                price:info.price,categoryIds:info.categoryIds,page:currentpage})
            .unwrap()
            .then(response=> {
                dispatch(setCourses({type: 'search', courses: response.response}))
                let {totalpages, totalcourses, totalcoursefetched} = response
                dispatch(setTotalPageandCourse({totalpages,totalcourses,totalcoursefetched}))
                
            })
            .catch(err=> {
                if(err.status === 500) {
                dispatch(setError(err))
                setTimeout(() => {
                  dispatch(removeError())
                }, 5000);
              }else if(err.status === 400) {
                toast.error("Please provide search text", {
                  position:toast.POSITION.TOP_RIGHT
                })
              }
              })
        }else if(info) {
            getCourses({skipcourses:currentpage,limitcourses:5,rating:info?.rating || null ,price:info?.price ||null,
            categoryIds:info.categoryIds || []}).unwrap()
            .then(response=> {
                dispatch(setCourses({type: 'notsearch', courses: response.response}))
                let {totalpages, totalcourses, totalcoursefetched} = response
                dispatch(setTotalPageandCourse({totalpages,totalcourses,totalcoursefetched}))
            })
            .catch(err=> {
                if(err.status === 500) {
                    dispatch(setError(err))
                    setTimeout(() => {
                      dispatch(removeError())
                    }, 5000);
                }
            })
        }

        
    },[search_params,filtercategories,currentpage])
    
    // const { data:bycategoryCourses=[], isError, isLoading, isSuccess } =
    //     useGetCoursesbyCateoryQuery({ categoryId: info?.id, skipcourses:skipCourses, limitcourses:12},{skip:info?.skip})

    


    const { data: userwishlist, isLoading: isWishListLoading, isError: isWishListError,
        isSuccess: isWishListSuccess, error: wishlisterro, refetch: refetchWishlist } = useGetUserWishlistQuery(user?._id)

    const [updateUserWishlist] = useAddorRemoveFromWishlistMutation()

    
    
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
                
            }

        } else {
            Navigate('/login')
        }
    }
    
    console.log(coursesdata.courses)
  return (
    <div id='displaycoursesmaindiv'>
        { (isLoading || isSearchLoading ) ? <Loading/> : coursesdata.courses.length > 0 ? <div id='displaycourses'>
            {coursesdata.courses.map((course,index)=> (
                <Course key={index} course={course} path={`/course/${course._id}`}
                wishlistStatus={wishlists?.length > 0 ? wishlists.includes(course._id) : false} 
                updateUserWishlist={updateWishlist}/>
            ))}
            
        </div> : <div className='text-center'>
            <h5>No courses found for your filter criteria</h5>
            </div>}
    </div>
  )
}

export default DisplayCourses